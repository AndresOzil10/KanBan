import { useEffect, useState } from "react"
import logo from "../src/assets/images/kayser_logo.webp"
import fondo from "../src/assets/images/banner.jpg"
import requested from "./assets/gif/requested.gif"
import LineChanges from "./Widgets/lineChanges"
import Material from "./Widgets/material"
import change from "./assets/gif/change.gif"

const App = () => { 
  const [hora, setHora] = useState(new Date())
  const [fecha, setFecha] = useState(new Date())

  useEffect(() => {
    const actualizarHora = () => {
      setHora(new Date())
      setFecha(new Date())
    }

    const intervalo = setInterval(actualizarHora, 1000)

    return () => clearInterval(intervalo)
  }, [])

  const formatearHora = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false })
  }

  const formatearFecha = (date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long' })
  }

  return (

    <div className=" h-[100vh] flex flex-col bg-cover items-center" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="flex justify-center w-full mt-8">
        <div className="card bg-error/13 w-96 shadow-sm mx-auto">
          <figure>
            <img src={logo} />
          </figure>
          <div className="card-body">
            <h2 className="card-title justify-center text-7xl">{formatearHora(hora)}</h2>
            <h1 className="text-center">{formatearFecha(fecha)}</h1>
          </div>
        </div>
      </div>
      <div className="divider divider-primary"></div>
      <div className="flex w-full mt-8 justify-center">
        <div className="flex justify-center w-full">
          {/* name of each tab group should be unique */}
          <div className="tabs tabs-lift">
              <label className="tab ">
                <input type="radio" name="my_tabs_4" defaultChecked/>
                <img src={change} alt="" width={20} height={20}/>
                Cambios de Linea
              </label>
            <div className="tab-content bg-base-100 border-base-300 p-6"><LineChanges /></div>

              <label className="tab">
                <input type="radio" name="my_tabs_4"  />
                <img src={requested} alt="" width={20} height={20}/>
                Material Solicitado
              </label>
            <div className="tab-content bg-base-100 border-base-300 p-6"><Material/></div>
          </div>
        </div>
      </div>
    </div>
  )
 }

 export default App