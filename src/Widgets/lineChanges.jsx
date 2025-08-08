import { useState } from "react";
import add from "../assets/gif/add.gif";
import CloseIcon from "../icons/close";
import SaveIcon from "../icons/saveIcon";
// import Notificacion from "./Notificacion"; // Asegúrate de tener este componente

const LineChanges = () => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [nombreNomina, setNombreNomina] = useState('');
    const [npProducto, setNpProducto] = useState('');
    const [ordenProduccion, setOrdenProduccion] = useState('');
    const [puestoTrabajo, setPuestoTrabajo] = useState('');
    const [componentes, setComponentes] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [mostrarNotificacion, setMostrarNotificacion] = useState(false);

    const agregarRegistro = async () => {
        setIsLoading(true);
        
    }

    return (
        <>
            <div className="overflow-x-auto shadow-2xl">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Solicitado</th>
                            <th>Area</th>
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
                        {/* Aquí puedes mapear tus datos de la base de datos */}
                        <tr>
                            <th>1</th>
                            <td>Cy Ganderton</td>
                            <td>Quality Control Specialist</td>
                            <td>Blue</td>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                            <td>test</td>
                            <td>2023-10-01</td>
                            <td><div className="badge badge-soft badge-warning">In Process</div></td>
                            <td>
                                <input type="checkbox" className="checkbox" />
                            </td>
                        </tr>
                        {/* Más filas aquí */}
                    </tbody>
                </table>
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
                    <div className="form-control rounded-2xl mt-3 border-2 text-center bg-gray-300">
                        <label>Puesto de Trabajo:</label>
                    </div>
                    <div className="mt-1.5">
                        <input type="text" required placeholder="Type here" className="input input-ghost w-full" value={puestoTrabajo} onChange={(e) => setPuestoTrabajo(e.target.value)} />
                    </div>
                    <div className="form-control mt-3 rounded-2xl border-2 text-center bg-gray-300">
                        <label>Componentes:</label>
                    </div>
                    <div className="mt-1.5">
                        <input type="text" required placeholder="Type here" className="input input-ghost w-full" value={componentes} onChange={(e) => setComponentes(e.target.value)} />
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
                </div>
            </dialog>
            {mostrarNotificacion && <Notificacion mensaje={mensaje} />}
        </>
    );
};

export default LineChanges
