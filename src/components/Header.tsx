export default function Header() {
  return (
    <header className="bg-gray-600 text-white p-4 flex items-center justify-between fixed top-0 left-0 w-full z-50">
      <h2 className="text-xl font-bold">WorkTime</h2>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="#" className="hover:underline">Dashboard</a></li>
          <li><a href="#" className="hover:underline">Profile</a></li>
          <li><a href="#" className="hover:underline">Logout</a></li>
        </ul>
      </nav>
    </header>
  )
}
