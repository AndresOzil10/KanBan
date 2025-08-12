import { useState } from "react"
import CloseIcon from "../icons/close"
import SaveIcon from "../icons/saveIcon"
import user from "../assets/gif/user.gif"
import gif from "../assets/gif/password.gif"

const Material = () => { 
  const [Login, setLogin] = useState(false)
  const [Usuario, setUsuario] = useState('')
  const [Password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const agregarRegistro = async () => {
        setIsLoading(true);
        
    }
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
              <h3 className="font-bold text-lg text-center">Log In!</h3>
                <div className="w-full flex flex-col items-center mt-3">
                  <label className="input validator">
                    <img src={user} alt="" width={20} height={20}/>
                    <input
                      type="input"
                      required
                      placeholder="Username"
                      pattern="[A-Za-z][A-Za-z0-9\-]*"
                      minLength="3"
                      maxLength="30"
                      title="Only letters, numbers or dash"
                      value={Usuario}
                      onChange={e => setUsuario(e.target.value)}
                    />
                  </label>
                  <p className="validator-hint">
                  Complet the username
                  </p>
              </div>
              <div className="w-full flex flex-col items-center">
                <label className="input validator">
                  <img src={gif} alt="" width={20} height={20}/>
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    minLength="8"
                    value={Password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </label>
                  <p className="validator-hint hidden">
                  Complet the password
                  </p>
              </div>
              <div className="modal-action ml-9 ">
                <button
                  className="btn bg-transparent border-none shadow-none"
                  onClick={agregarRegistro}
                  disabled={isLoading}
                >
                  {isLoading ? <span className="loading loading-infinity text-info"></span> : "Login"}
                </button>
                <button className="btn bg-transparent border-none shadow-none" onClick={() => setLogin(false)}>
                  <CloseIcon />
                </button>
              </div>
            </div>
          </dialog>
        </div>
        </>
    )
 }

 export default Material