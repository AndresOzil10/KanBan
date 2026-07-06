import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus, Save, ChevronLeft, ChevronRight, Eye, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Swal from 'sweetalert2';

const url = import.meta.env.VITE_API_URL

const enviarData = async (url, data) => {
  const resp = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const json = await resp.json()
  return json
}

const Configuration = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para CRUD
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para formulario
  const [formData, setFormData] = useState({
    id: '',
    bito: '',
    nom_pt: '',
    material: '',
    descripcion: '',
    sp: '',
    tipo: '',
    suministro: '',
    puesto: '',
    color: ''
  });
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [visiblePages, setVisiblePages] = useState([]);

  // Función para cargar datos
  const Data = async () => {
    setLoading(true);
    const Pendientes = {
      "aksi": "DataBase",
    }
    try {
      const respuesta = await enviarData(url, Pendientes)
      console.log("Datos recibidos:", respuesta);
      
      if (respuesta && respuesta.data) {
        setData(respuesta.data);
        setFilteredData(respuesta.data);
        setTotalPages(Math.ceil(respuesta.data.length / itemsPerPage));
        setError(null);
      } else {
        setError('No se recibieron datos de la API');
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError('Error al cargar los datos');
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los datos',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    Data();
  }, []);
  
  // Calcular páginas visibles
  useEffect(() => {
    if (totalPages <= 1) {
      setVisiblePages([1]);
      return;
    }
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    setVisiblePages(pages);
  }, [currentPage, totalPages]);
  
  // Filtrar datos cuando cambian la búsqueda o items por página
  useEffect(() => {
    if (!data || data.length === 0) return;
    
    let result = [...data];
    
    // Aplicar búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => {
        if (!item) return false;
        
        return (
          (item.bito && item.bito.toString().toLowerCase().includes(term)) ||
          (item.nom_pt && item.nom_pt.toLowerCase().includes(term)) ||
          (item.material && item.material.toString().toLowerCase().includes(term)) ||
          (item.descripcion && item.descripcion.toLowerCase().includes(term)) ||
          (item.tipo && item.tipo.toLowerCase().includes(term))
        );
      });
    }
    
    setFilteredData(result);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchTerm, data, itemsPerPage]);
  
  // Obtener datos de la página actual
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };
  
  // Ir a página específica
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Abrir modal para crear nuevo
  const handleCreate = () => {
    setFormData({
      id: '',
      bito: '',
      nom_pt: '',
      material: '',
      descripcion: '',
      sp: '',
      tipo: '',
      suministro: '',
      puesto: '',
      color: ''
    });
    setIsModalOpen(true);
  };
  
  // Abrir modal para editar
  const handleEdit = (item) => {
    setFormData({ 
      id: item.id || '',
      bito: item.bito || '',
      nom_pt: item.nom_pt || '',
      material: item.material || '',
      descripcion: item.descripcion || '',
      sp: item.sp || '',
      tipo: item.tipo || '',
      suministro: item.suministro || '',
      puesto: item.puesto || '',
      color: item.color || ''
    });
    setIsModalOpen(true);
  };
  
  // Abrir modal para ver detalles
  const handleView = (item) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };
  
  // Abrir modal para eliminar
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };
  
  // Guardar datos (crear o actualizar)
  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (formData.id) {
        // Actualizar
        const updateData = {
            "aksi": "ActualizarDataBase",
            "id": formData.id,
            "bito": formData.bito,
            "nom_pt": formData.nom_pt,
            "material": formData.material,
            "descripcion": formData.descripcion,
            "sp": formData.sp,
            "tipo": formData.tipo,
            "suministro": formData.suministro,
            "puesto": formData.puesto,
        }
        const respuesta = await enviarData(url, updateData)
        if( respuesta.estado === 'success'){
            Swal.fire({
                title: '¡Éxito!',
                text: 'Registro actualizado correctamente',
                icon: 'success',
                timer: 2000
            });
            Data()

        } else {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar el registro',
                icon: 'error'
            });
        }
        // console.log("Actualizando registro con ID:", formData);
      } else {
        // Crear nuevo
        const newData = {
            "aksi": "GuardarDataBase",
            "bito": formData.bito,
            "nom_pt": formData.nom_pt,
            "material": formData.material,
            "descripcion": formData.descripcion,
            "sp": formData.sp,
            "tipo": formData.tipo,
            "suministro": formData.suministro,
            "puesto": formData.puesto,
        }
        const respuesta = await enviarData(url, newData)
        if( respuesta.estado === 'success'){
            Swal.fire({
                title: '¡Éxito!',
                text: 'Registro creado correctamente',
                icon: 'success',
                timer: 2000
            });
            Data()
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo crear el registro',
                icon: 'error'
            });
        }
      }
      setIsModalOpen(false);
      setFormData({
        id: '',
        bito: '',
        nom_pt: '',
        material: '',
        descripcion: '',
        sp: '',
        tipo: '',
        suministro: '',
        puesto: '',
        color: ''
      });
    } catch (err) {
      setError('Error al guardar los datos');
      console.error(err);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar el registro',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Eliminar registro
  const handleDelete = async () => {
    try {
        setLoading(true)
        const Eliminar = {
            "aksi": "EliminarDataBase",
            "id": selectedItem.id
        }
        const respuesta = await enviarData(url, Eliminar)
        if( respuesta.estado === 'success'){
            Swal.fire({
                title: '¡Eliminado!',
                text: 'Registro eliminado correctamente',
                icon: 'success',
                timer: 2000
            });
            
            setIsDeleteModalOpen(false);
            setSelectedItem(null);
            Data()
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar el registro',
                icon: 'error'
            });
        }
    } catch (err) {
      setError('Error al eliminar el registro');
      console.error(err);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el registro',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Gestión de Base de Datos</h1>
            <p className="text-gray-600 mt-2">Administra los registros del sistema KanBan</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              className="btn btn-primary"
              onClick={handleCreate}
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              Nuevo Registro
            </button>
            <button 
              className="btn btn-outline"
              onClick={Data}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Actualizar'
              )}
            </button>
          </div>
        </div>
      </div>
  
      {/* Panel de búsqueda y controles */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Búsqueda */}
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por Bito, Material, Descripción..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            {/* Items por página */}
            <div className="flex items-center gap-2">
              <label className="label-text whitespace-nowrap">Mostrar:</label>
              <select 
                className="select select-bordered select-sm"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                disabled={loading}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <label className="label-text whitespace-nowrap">registros</label>
            </div>
          </div>
        </div>
      </div>
  
      {/* Tabla de datos */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body p-0">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-gray-600">Cargando datos...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error m-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600">No se encontraron registros</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr className="bg-base-300">
                      <th className="w-16 text-center">ID</th>
                      <th className="text-center">Bito</th>
                      <th className="text-center">Nombre PT</th>
                      <th className="text-center">Material</th>
                      <th className="text-center">Descripción</th>
                      <th className="text-center">SP</th>
                      <th className="text-center">Tipo</th>
                      <th className="text-center">Suministro</th>
                      <th className="text-center">Puesto</th>
                      <th className="text-center">Ayuda Visual</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCurrentPageData().map((item, index) => (
                      <tr key={item.id || index} className="hover">
                        <td className="text-center font-mono">{item.id || 'N/A'}</td>
                        <td className="text-center">{item.bito || 'N/A'}</td>
                        <td className="max-w-xs truncate" title={item.nom_pt}>
                          {item.nom_pt || 'N/A'}
                        </td>
                        <td className="text-center font-mono">{item.material || 'N/A'}</td>
                        <td className="max-w-xs truncate" title={item.descripcion}>
                          {item.descripcion || 'N/A'}
                        </td>
                        <td className="text-center">{item.sp || 'N/A'}</td>
                        <td className="text-center">
                          <span className="badge badge-outline">
                            {item.tipo || 'N/A'}
                          </span>
                        </td>
                        <td className="text-center">{item.suministro || 'N/A'}</td>
                        <td className="text-center">{item.puesto || 'N/A'}</td>
                        <td className="text-center">
                          {item.color ? (
                            <div className="flex items-center justify-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <span>{item.color}</span>
                            </div>
                          ) : 'N/A'}
                        </td>
                        <td>
                          <div className="flex justify-center gap-2">
                            <button
                              className="btn btn-ghost btn-xs"
                              onClick={() => handleView(item)}
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="btn btn-ghost btn-xs text-warning"
                              onClick={() => handleEdit(item)}
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="btn btn-ghost btn-xs text-error"
                              onClick={() => handleDeleteClick(item)}
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
  
              {/* Paginación mejorada */}
              <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t gap-4">
                <div className="text-sm text-gray-600">
                  Mostrando <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
                  <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> de{' '}
                  <span className="font-semibold">{filteredData.length}</span> registros
                  {totalPages > 1 && (
                    <span> • Página <span className="font-semibold">{currentPage}</span> de <span className="font-semibold">{totalPages}</span></span>
                  )}
                </div>
                
                {/* Navegación de páginas */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Navegación por número de página */}
                    <div className="flex items-center gap-1">
                      {/* Botón primera página */}
                      <button
                        className="btn btn-sm btn-square btn-ghost"
                        onClick={() => goToPage(1)}
                        disabled={currentPage === 1}
                        title="Primera página"
                      >
                        <ChevronsLeft className="w-4 h-4" />
                      </button>
                      
                      {/* Botón página anterior */}
                      <button
                        className="btn btn-sm btn-square btn-ghost"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        title="Página anterior"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      {/* Páginas visibles */}
                      <div className="flex items-center gap-1">
                        {visiblePages.map(page => (
                          <button
                            key={page}
                            className={`btn btn-sm btn-square ${currentPage === page ? 'btn-active' : 'btn-ghost'}`}
                            onClick={() => goToPage(page)}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      {/* Puntos suspensivos si hay más páginas antes */}
                      {visiblePages[0] > 2 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      
                      {/* Mostrar página 1 si no está visible */}
                      {visiblePages[0] > 1 && (
                        <button
                          className="btn btn-sm btn-square btn-ghost"
                          onClick={() => goToPage(1)}
                        >
                          1
                        </button>
                      )}
                      
                      {/* Puntos suspensivos si hay más páginas después */}
                      {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      
                      {/* Mostrar última página si no está visible */}
                      {visiblePages[visiblePages.length - 1] < totalPages && (
                        <button
                          className="btn btn-sm btn-square btn-ghost"
                          onClick={() => goToPage(totalPages)}
                        >
                          {totalPages}
                        </button>
                      )}
                      
                      {/* Botón página siguiente */}
                      <button
                        className="btn btn-sm btn-square btn-ghost"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        title="Página siguiente"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      
                      {/* Botón última página */}
                      <button
                        className="btn btn-sm btn-square btn-ghost"
                        onClick={() => goToPage(totalPages)}
                        disabled={currentPage === totalPages}
                        title="Última página"
                      >
                        <ChevronsRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Selector de salto a página */}
                    <div className="flex items-center gap-2">
                      <label className="label-text whitespace-nowrap">Ir a:</label>
                      <div className="join">
                        <input
                          type="number"
                          min="1"
                          max={totalPages}
                          className="input input-bordered input-sm w-20 join-item"
                          value={currentPage}
                          onChange={(e) => {
                            const page = parseInt(e.target.value);
                            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                              goToPage(page);
                            }
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const page = parseInt(e.target.value);
                              if (!isNaN(page) && page >= 1 && page <= totalPages) {
                                goToPage(page);
                              }
                            }
                          }}
                        />
                        <button
                          className="btn btn-sm join-item"
                          onClick={() => {
                            const input = document.querySelector('input[type="number"]');
                            if (input) {
                              const page = parseInt(input.value);
                              if (!isNaN(page) && page >= 1 && page <= totalPages) {
                                goToPage(page);
                              }
                            }
                          }}
                        >
                          Ir
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
  
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stats bg-primary text-primary-content shadow">
          <div className="stat">
            <div className="stat-title">Total Registros</div>
            <div className="stat-value">{data.length}</div>
            <div className="stat-desc">En la base de datos</div>
          </div>
        </div>
        
        <div className="stats bg-success text-success-content shadow">
          <div className="stat">
            <div className="stat-title">Filtrados</div>
            <div className="stat-value">{filteredData.length}</div>
            <div className="stat-desc">Registros encontrados</div>
          </div>
        </div>
        
        <div className="stats bg-info text-info-content shadow">
          <div className="stat">
            <div className="stat-title">Páginas</div>
            <div className="stat-value">{totalPages}</div>
            <div className="stat-desc">Página actual: {currentPage}</div>
          </div>
        </div>
      </div>
  
      {/* Modal para crear/editar */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-2xl mb-4">
              {formData.id ? 'Editar Registro' : 'Nuevo Registro'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bito</span>
                </label>
                <input
                  type="text"
                  name="bito"
                  className="input input-bordered"
                  value={formData.bito}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nombre PT</span>
                </label>
                <input
                  type="text"
                  name="nom_pt"
                  className="input input-bordered"
                  value={formData.nom_pt}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Material</span>
                </label>
                <input
                  type="text"
                  name="material"
                  className="input input-bordered"
                  value={formData.material}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">SP</span>
                </label>
                <input
                  type="text"
                  name="sp"
                  className="input input-bordered"
                  value={formData.sp}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tipo</span>
                </label>
                <input
                  type="text"
                  name="tipo"
                  className="input input-bordered"
                  value={formData.tipo}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Suministro</span>
                </label>
                <input
                  type="text"
                  name="suministro"
                  className="input input-bordered"
                  value={formData.suministro}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Puesto</span>
                </label>
                <input
                  type="text"
                  name="puesto"
                  className="input input-bordered"
                  value={formData.puesto}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Descripción</span>
                </label>
                <textarea
                  name="descripcion"
                  className="textarea textarea-bordered h-24"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Modal para ver detalles */}
      {isViewModalOpen && selectedItem && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <button 
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setIsViewModalOpen(false)}
            >
              ✕
            </button>
            
            <h3 className="font-bold text-2xl mb-4">Detalles del Registro</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">ID:</span>
                  <span className="ml-2 font-mono">{selectedItem.id || 'N/A'}</span>
                </div>
                
                <div>
                  <span className="font-semibold">Bito:</span>
                  <span className="ml-2">{selectedItem.bito || 'N/A'}</span>
                </div>
                
                <div>
                  <span className="font-semibold">Nombre PT:</span>
                  <span className="ml-2">{selectedItem.nom_pt || 'N/A'}</span>
                </div>
                
                <div>
                  <span className="font-semibold">Material:</span>
                  <span className="ml-2 font-mono">{selectedItem.material || 'N/A'}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">SP:</span>
                  <span className="ml-2">{selectedItem.sp || 'N/A'}</span>
                </div>
                
                <div>
                  <span className="font-semibold">Tipo:</span>
                  <span className="ml-2 badge badge-outline">
                    {selectedItem.tipo || 'N/A'}
                  </span>
                </div>
                
                <div>
                  <span className="font-semibold">Suministro:</span>
                  <span className="ml-2">{selectedItem.suministro || 'N/A'}</span>
                </div>
                
                <div>
                  <span className="font-semibold">Puesto:</span>
                  <span className="ml-2">{selectedItem.puesto || 'N/A'}</span>
                </div>
                
                <div>
                  <span className="font-semibold">Color:</span>
                  <span className="ml-2">{selectedItem.color || 'N/A'}</span>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <span className="font-semibold block mb-2">Descripción:</span>
                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedItem.descripcion || 'Sin descripción'}</p>
                </div>
              </div>
            </div>
            
            <div className="modal-action mt-6">
              <button
                className="btn btn-primary"
                onClick={() => setIsViewModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Modal para eliminar */}
      {isDeleteModalOpen && selectedItem && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-2xl mb-4">Confirmar Eliminación</h3>
            
            <div className="alert alert-error mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.698-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.</span>
            </div>
            
            <div className="bg-base-200 p-4 rounded-lg mb-6">
              <p className="font-semibold text-lg">{selectedItem.nom_pt || 'Registro sin nombre'}</p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Bito:</strong> {selectedItem.bito || 'N/A'} • 
                <strong> Material:</strong> {selectedItem.material || 'N/A'} • 
                <strong> Tipo:</strong> {selectedItem.tipo || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {selectedItem.descripcion ? selectedItem.descripcion.substring(0, 100) + '...' : 'Sin descripción'}
              </p>
            </div>
            
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className="btn btn-error"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuration;