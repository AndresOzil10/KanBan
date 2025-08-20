import { useCallback, useEffect, useState } from "react"
import add from "../assets/gif/add.gif"
import CloseIcon from "../icons/close"
import SaveIcon from "../icons/saveIcon"

const url = "http://localhost/API/Kanban/functions.php"

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
      throw new Error('Error en la respuesta de la API')
    }
    return await resp.json();
  } catch (error) {
    console.error("Error en la solicitud:", error)
    throw error
  }
}

const LineChanges = () => {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [nombreNomina, setNombreNomina] = useState('')
    const [npProducto, setNpProducto] = useState('')
    const [ordenProduccion, setOrdenProduccion] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [login, setLogin] = useState(false)
    const [mostrarNotificacion, setMostrarNotificacion] = useState(false)
    const [Error, setError] = useState(null)
    const [Dato, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [recordsPerPage] = useState(10) 

    const fetchData = useCallback(async () => {
        const info = { aksi: "LineChange" }
        try {
            const response = await enviarData(url, info);
            setData(response.data);
        } catch (error) {
            setError("Error al obtener los datos. Intenta de nuevo más tarde.")
        }
    }, [])

    useEffect(() => {
        fetchData();
    }, [fetchData])

    const agregarRegistro = async () => {
        if (!nombreNomina || !npProducto || !ordenProduccion) {
            setMostrarNotificacion(true);
            setTimeout(() => setMostrarNotificacion(false), 3000);
            return;
        }
        const info = {
            aksi: "addLineChange",
            nn: nombreNomina,
            np: npProducto,
            op: ordenProduccion,
        };
        setIsLoading(true);
        const response = await enviarData(url, info);
        if (response.status === 'error') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.message,
            });
        } else if (response.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.message,
            });
            setLogin(false);
            fetchData();
        }
        setNombreNomina('');
        setNpProducto('');
        setOrdenProduccion('');
    }

    // Calcular los registros a mostrar en la página actual
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = Dato.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(Dato.length / recordsPerPage);

    return (
        <>
            <div className="overflow-x-auto shadow-2xl">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>NP PT</th>
                            <th>Orden</th>
                            <th>info</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Estatus</th>
                            <th>Check</th>
                            <th>Ayuda Visual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(Array.isArray(currentRecords) ? currentRecords : []).map((item, index) => (
                            <tr key={index}>
                                <th>{item.id}</th>
                                <td>{item.np}</td>
                                <td>{item.op}</td>
                                <td><button className="btn btn-ghost btn-xs">a</button></td>
                                <td>{item.fecha}</td>
                                <td>{item.hora}</td>
                                <td>
                                    {item.estatus === "En Proceso" ? (
                                        <div className="badge badge-outline badge-warning">En Proceso</div>
                                    ) : item.estatus === "Preparado" ? (
                                        <div className="badge badge-outline badge-success">Preparado</div>
                                    ) : item.estatus === "Recibido" ? (
                                        <div className="badge badge-outline badge-info">Recibido</div>
                                    ) : null}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-ghost btn-xs"
                                        onClick={() => {
                                            setLogin(true);
                                            setSelectedId(item.id);
                                            setSelectedStatus(item.estatus);
                                        }}
                                        disabled={item.estatus === "Preparado"}
                                    >
                                        Check
                                    </button>
                                </td>
                                <td>
                                    <div aria-label="status" className="status status-xl" style={{ backgroundColor: item.color }}></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-between mt-4">
                    <button
                        className="btn"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button
                        className="btn"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </button>
                </div>
                <dialog open={login} className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Hello!</h3>
                        <p className="py-4">Press ESC key or click the button below to close</p>
                        <div className="modal-action">
                            <form method="dialog">
                                <button className="btn" onClick={() => setLogin(false)}>Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
            <div className="flex justify-end">
                <button className="btn bg-transparent border-none mt-4 btn-square shadow-none" onClick={() => setOpen(true)}>
                    <img src={add} alt="" width={20} height={20} />
                </button>
            </div>
            <dialog open={open} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-center">Cambios de Línea</h3>
                    <div className="form-control rounded-2xl mt-3 border-2 text-center bg-gray-300">
                        <label>Numero Nomina:</label>
                    </div>
                    <div className="mt-1.5">
                        <input type="text" className="input input-ghost w-full" required placeholder="Type here" value={nombreNomina} onChange={(e) => setNombreNomina(e.target.value)} />
                    </div>
                    <div className="form-control rounded-2xl mt-3 border-2 text-center bg-gray-300">
                        <label>NP Producto Terminado:</label>
                    </div>
                    <div className="mt-1.5">
                        <input type="text" required placeholder="Type here" className="input input-ghost w-full" value={npProducto} onChange={(e) => setNpProducto(e.target.value)} />
                    </div>
                    <div className="form-control rounded-2xl mt-3 border-2 text-center bg-gray-300">
                        <label>Orden de Producción:</label>
                    </div>
                    <div className="mt-1.5">
                        <input type="text" required placeholder="Type here" className="input input-ghost w-full" value={ordenProduccion} onChange={(e) => setOrdenProduccion(e.target.value)} />
                    </div>
                    <div className="modal-action ml-3 ">
                        <button
                            className="btn bg-transparent border-none shadow-none"
                            onClick={agregarRegistro}
                            disabled={isLoading}
                        >
                            {isLoading ? <span className="loading loading-infinity text-info"></span> : <SaveIcon />}
                        </button>
                        <button className="btn bg-transparent border-none shadow-none" onClick={() => setOpen(false)}>
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
        </>
    );
};

export default LineChanges
