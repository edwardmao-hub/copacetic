export default function Layout(props) {
    
    const { children } = props

    return (
        <>
            <header>
                <h1 className="text-gradient">copacetic</h1>
            </header>
            <main>
                { children }
            </main>
            <footer>
                <small>Created by</small>
                <a target="_blank" href="https://github.com/edwardmao-hub">
                    <img alt="pfp" src="https://avatars.githubusercontent.com/u/27038013?v=4" />
                    <p>@edwardmao-hub</p>
                    <i class="fa-brands fa-github"></i>
                </a>
                
            </footer>
        </>
    )
}