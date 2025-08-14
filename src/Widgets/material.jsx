import { useCallback, useEffect, useState } from "react";
import CloseIcon from "../icons/close";
import user from "../assets/gif/user.gif";
import gif from "../assets/gif/password.gif";

const url = "http://localhost/API/Kanban/functions.php";

const enviarData = async (url, data) => {
  try {
    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!resp.ok) {
      throw new Error('Error en la respuesta de la API');
    }
    return await resp.json();
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
}

const Material = () => { 
  const [Login, setLogin] = useState(false);
  const [Usuario, setUsuario] = useState('');
  const [Password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [Dato, setData] = useState([]);
  const [error, setError] = useState(null);
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false)

  const fetchData = useCallback( async () => {
    const info = { aksi: "requested" };
    try {
      const response = await enviarData(url, info);
      setData(response.data || [])
    } catch (error) {
      setError("Error al obtener los datos. Intenta de nuevo más tarde.");
    }
  }, [] )

  useEffect(() => {
    fetchData()
  }, [])

  

  const agregarRegistro = async () => {
    if (!Usuario || !Password) {
      setMostrarNotificacion(true);
      setTimeout(() => setMostrarNotificacion(false), 3000);
      return;
    }
    setIsLoading(true);
    // Aquí puedes agregar la lógica para enviar el registro
    // Por ejemplo, enviar los datos a la API
    setIsLoading(false);
  }

  return (
    <>
      <div className="overflow-x-auto shadow-2xl">
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
            {(Array.isArray(Dato) ? Dato : []).map((item, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{item.codigo}</td>
                <td>{item.nommat}</td>
                <td>{item.sp}</td>
                <td>{item.ubicacion}</td>
                <td>{item.contenedor}</td>
                <td></td>
                <td></td>
                <td>{item.fecha}</td>
                <td>
                  {item.estatus === "Pendiente" ? (
                    <div className="badge badge-outline badge-warning">Pending</div>
                  ) : item.estatus === "Completo" ? (
                    <div className="badge badge-success">Entregado</div>
                  ) : item.estatus === "En Proceso" ? (
                    <div className="badge badge-info">En Proceso</div>
                  ): null}
                </td>
                <td><button className="btn btn-ghost btn-xs" onClick={()=>setLogin(true)}>Check</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <dialog open={Login} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">Log In!</h3>
            <div className="w-full flex flex-col items-center mt-3">
              <label className="input validator">
                <img src={user} alt="" width={20} height={20} />
                <input
                  type="text"
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
              <p className="validator-hint">Completa el nombre de usuario</p>
            </div>
            <div className="w-full flex flex-col items-center">
              <label className="input validator">
                <img src={gif} alt="" width={20} height={20} />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  minLength="8"
                  value={Password}
                  onChange={e => setPassword(e.target.value)}
                />
              </label>
              <p className="validator-hint hidden">Completa la contraseña</p>
            </div>
            <div className="modal-action ml-9 ">
              <button
                className="btn bg-transparent border-none shadow-none"
                onClick={agregarRegistro}
                disabled={isLoading}
              >
                {isLoading ? <span className="loading loading-infinity text-info"></span> : "Sign In"}
              </button>
              <button className="btn bg-transparent border-none shadow-none" onClick={() => setLogin(false)}>
                <CloseIcon />
              </button>
            </div>
            {mostrarNotificacion ? <div role="alert" className="alert alert-error" >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><b>Campos Vacios!</b> Favor de Completarlos.</span>
            </div> : null}
          </div>
        </dialog>
      </div>
    </>
  );
}

export default Material