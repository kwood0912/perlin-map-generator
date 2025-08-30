
export default function Home() {
  return (
    <div className='container-fluid' style={{ height: '100vh', backgroundColor: 'tan' }}>
      <h1>Island Generator Tool</h1>
      <div className='row h-100'>
        <div className="col-12 col-md-6 col-lg-3 col-xl-2">
          <ul className="list-group">
            <li className="list-group-item">
              <a href="/parcelbound" className="btn btn-primary">Go to Parcelbound</a>
            </li>
            <li className="list-group-item">
              <a href="/nightsofnil" className="btn btn-primary">Go to Nights of Nil</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
