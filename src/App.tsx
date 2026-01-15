import Header from "./components/Header"
import Dashboard from "./components/Dashboard"

function App() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <Header />
      <div className="flex-1 flex flex-col items-center w-full">
        <Dashboard />
      </div>
    </div>
  )
}

export default App
