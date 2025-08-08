const Material = () => { 
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
                    <input type="checkbox" className="checkbox" />
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
        </div>
        </>
    )
 }

 export default Material