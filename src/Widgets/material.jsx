import { useState } from "react"

const Material = () => { 
  const [Login, setLogin] = useState(false)
    return (
        <>
            <div className="overflow-x-auto shadow-2xl">
        {/* <h1 className="text-center">Material Solicitado</h1> */}
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>N. Material</th>
                <th>Nombre</th>
                <th>SP</th>
                <th>Ubicacion</th>
                <th>Contenedor</th>
                <th>Ayuda Visual</th>
                <th>Puesto Trabajo</th>
                <th>Fecha</th>
                <th>Estatus</th>
                <th>Check</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>1</th>
                <td>Jane Doe</td>
                <td>Developer</td>
                <td>Green</td>
                <td>test</td>
                <td>test</td>
                <td>test</td>
                <td>test</td>
                <td>2023-10-01</td>
                <td><div className="badge badge-soft badge-error">Pending</div></td>
                <td>
                    <button className="btn btn-ghost btn-xs" onClick={()=> setLogin(true)}>Check</button>
                </td>
              </tr>
              <tr>
                <th>2</th>
                <td>John Smith</td>
                <td>Designer</td>
                <td>Yellow</td>
              </tr>
              <tr>
                <th>3</th>
                <td>Emily Clark</td>
                <td>Manager</td>
                <td>Orange</td>
              </tr>
            </tbody>
          </table>
          <dialog open={Login} className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Hello!</h3>
              <p className="py-4">Press ESC key or click the button below to close</p>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn" onClick={()=>setLogin(false)}>Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
        </>
    )
 }

 export default Material