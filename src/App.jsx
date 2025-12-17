import Challenge from "./components/layouts/Challenge.jsx"
import Dashboard from "./components/layouts/Dashboard.jsx"
import Welcome from "./components/layouts/Welcome.jsx"
import Layout from "./components/layouts/Layout.jsx"
import { useState, useEffect } from "react"

import WORDS from './utsil/VOCAB.json'
import { countdownIn24Hours, getWordByIndex, PLAN} from './utils'

function App() {

  const [selectedPage, setSelectedPage] = useState(0)
  //zero is for welcome, 1 is for dashboard, 2 is for challenge
  // const selectedPage = 2 
  const [name, setName] = useState('')
  const [day, setDay] = useState(1)
  const [datetime, setDatetime] = useState(null)
  const [history, setHistory] = useState({})
  const [attempts, setAttempts] = useState(0)

  const daysWords = PLAN[day].map((idx) => {
    return getWordByIndex(WORDS, idx).word
  })

  function handleChangePage(pageIndex){
    setSelectedPage(pageIndex)
  }

  function handleCreateAccount(){
    if(!name){ return }
    localStorage.setItem('username', name)
    handleChangePage(1)
  }
  
  function handleCompleteDay(){
    const newDay = day++
    const newDatetime = Date.now()
    setDay(newDay)
    setDatetime(newDatetime)

    localStorage.setItem('day', JSON.stringify({
      day: newDay, datetime: newDatetime
    }))
    setSelectedPage(1)
  }

  function handleIncrementAttempts(){
    //take curr attmpt num, increment and save it to local storage
    const newRecord = attempts++
    localStorage.setItem('attempts', newRecord)
    setAttempts(newRecord)
  }

  useEffect(() => {
    //this callback function is triggered on page load
    if(!localStorage){ return }
    if(localStorage.getItem('username')){ 
      setName(localStorage.getItem('username'))
      setSelectedPage(1)
    }

    if(localStorage.getItem('attempts')){
      //then we found attempts
      setAttempts(parseInt(localStorage.getItem('attempts')))
    }

    if(localStorage.getItem('history')){
      setHistory(JSON.parse(localStorage.getItem('history')))
    }

    if(localStorage.getItem('day')){
      const { day: d, datetime: dt } = JSON.parse(localStorage.getItem('day'))
      setDatetime(dt)
      setDay(d)

      if(d > 1 && dt){
        const diff = countdownIn24Hours(dt)
        if(diff < 0){
          let newHistory = {...history}
          const timestamp = new Date(dt)
          const formattedTimestamp = timestamp.toString().split(' ').slice(1, 4).join(' ')
          newHistory[formattedTimestamp] = d 
          setHistory(newHistory)
          setDatetime(1)
          setDatetime(null)
          setAttempts(0)

          localStorage.setItem('attempts', 0)
          localStorage.setItem('history', JSON.stringify(newHistory))
          localStorage.setItem('day', JSON.stringify({ day: 1, datetime: null }))
        }
      }
    }
  }, [])

  const pages = {
    0: <Welcome handleCreateAccount={handleCreateAccount} username="hello world" name={name} setName={setName} />,
    1: <Dashboard history={history} name={name} attempts={attempts} PLAN={PLAN} day={day} handleChangePage={handleChangePage} 
      daysWords={dayswords} datetime={datetime}/>,
    2: <Challenge day={day} daysWords={daysWords} handleChangePage={handleChangePage} 
      handleIncrementAttempts={handleIncrementAttempts} handleCompleteDay={handleCompleteDay} PLAN={PLAN}/>,
  }
  
  return (
    <Layout>
      {pages[selectedPage]}
    </Layout> 
  )
}

export default App
