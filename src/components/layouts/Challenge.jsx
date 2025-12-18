import { useState } from "react"
import ProgressBar from "../ProgressBar"
import { isEncountered, shuffle } from ".././utils"
import DEFINITIONS from ".././utils/VOCAB.json"

export default function Challenge(props) {
    const { day, daysWords, handleChangePage, 
    handleIncrementAttempts, handleCompleteDay, PLAN } = props

    const [wordIndex, setWordIndex] = useState(0)
    const [inputVal, setInputVal] = useState("")
    const [showDefinition, setShowDefinition] = useState(false)
    const [listToLearn, setListToLearn] = useState([
        ...daysWords,
        ...shuffle(daysWords),
        ...shuffle(daysWords),
        ...shuffle(daysWords),
    ])

    const word = listToLearn[wordIndex]
    const isNewWord = showDefinition || 
    (!isEncountered(day, word) && wordIndex < daysWords.length)
    const definition = DEFINITIONS[word]

    function giveUp(){
        setListToLearn([...listToLearn, word])
        setShowDefinition(true)
    }

    return (
        <section id="challenge">
            <h1>{word}</h1>
            {isNewWord && (<p>{definition}</p>)}
            <div className="helper">
                <div>
                    {/* CONTAINS ALL THE ERROR CORRECTION VISUAL BARS */}
                    {[...Array(definition.length).keys()]
                        .map((char, eleIdx) =>{
                            // determine char is correct or not
                            // red = incorrect, blue = correct
                            const styleToApply = inputVal.length < char + 1 
                            ? '' 
                                : inputVal.split('')[eleIdx].toLowerCase() == definition.split('')[eleIdx].toLowerCase()
                                ? 'correct'
                                : 'incorrect'

                            return (
                                <div className={'' + styleToApply} key={eleIdx}></div>
                            )
                        })}
                </div>
                <input value={inputVal} onChange={(e) => {
                    //user entered correct # of chars =
                    //1) entry correct, need to increment attempts -> next word
                    //2) entry incorrect, increment attempts, also if 
                    if(e.target.value.length == definition.length && e.target.value.length > inputVal.length){
                        //compare words
                        handleIncrementAttempts()
                        if(e.target.value.toLowerCase() == definition.toLowerCase()){
                            //then user has correct input
                            if(wordIndex >= listToLearn.length-1){
                                handleCompleteDay()
                                return
                            }
                            setWordIndex(wordIndex+1)
                            setShowDefinition(false)
                            setInputVal('')
                            return
                            ///check if finished all words -> end day else go to the next word
                        }
                    }
                    setInputVal(e.target.value)
                }} type="text" placeholder="Enter the definition..."/>
                <div className="challenge-btns">
                    <button onClick={() => {handleChangePage(1)}} className="card-button-secondary">
                        <h6>Quit</h6>
                    </button>
                    <button onClick={giveUp}className="card-button-primary">
                        <h6>I forgot</h6>
                    </button>
                </div>
                <ProgressBar remainder={wordIndex * 100 / listToLearn.length} text={`${wordIndex} / ${listToLearn.length}`}/>
            </div>
        </section>
    )
}