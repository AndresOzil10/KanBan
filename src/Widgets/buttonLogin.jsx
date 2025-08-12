import { useEffect, useState } from "react"
import user from "../assets/gif/user.gif"
import gif from "../assets/gif/password.gif"
import CloseIcon from "../icons/close"

const ButtonLogin = () => { 
    const [visible, setVisible] = useState(true)
    const [Login, setLogin] = useState(false)
    const [Usuario, setUsuario] = useState('')
    const [Password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(prevVisible => !prevVisible);
        }, 500); // Cambia el valor a la cantidad de milisegundos que desees (500 ms en este caso)
        return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
    }, [])

    const agregarRegistro = async () => {
        setIsLoading(true);
        
    }

    return (
        <>
            <button
            style={{
                display: visible ? 'block' : 'none',
                padding: '10px 20px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'opacity 0.3s',
            }}
            className="btn btn-block btn-xs"
            onClick={()=> setLogin(true)}
        >
            Change
        </button>

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
        </>
    )
 }

 export default ButtonLogin