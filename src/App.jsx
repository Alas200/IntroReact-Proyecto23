import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

function App() {
  // Persistencia: cargar tareas iniciales desde localStorage
  const [tareas, setTareas] = useState(() => {
    const tareasGuardadas = localStorage.getItem('tareas_react');
    return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
  });

  const [nuevaTarea, setNuevaTarea] = useState('');
  const [duracion, setDuracion] = useState('');
  const [filtroDuracion, setFiltroDuracion] = useState('todas');

  // Guardar tareas en localStorage ante cada cambio
  useEffect(() => {
    localStorage.setItem('tareas_react', JSON.stringify(tareas));
  }, [tareas]);

  // useMemo para el cálculo del tiempo total
  const calcularTiempoTotal = useMemo(() => {
    return tareas.reduce((total, tarea) => total + tarea.duracion, 0);
  }, [tareas]);

  // Actualizar el título de la página
  useEffect(() => {
    document.title = `Total: ${calcularTiempoTotal} min`;
  }, [calcularTiempoTotal]);

  // Filtrado de tareas dinámico
  const tareasFiltradas = useMemo(() => {
    if (filtroDuracion === 'cortas') return tareas.filter(t => t.duracion <= 15);
    if (filtroDuracion === 'largas') return tareas.filter(t => t.duracion > 15);
    return tareas;
  }, [tareas, filtroDuracion]);

  const agregarTarea = () => {
    if (nuevaTarea.trim() && duracion) {
      const nuevaTareaObj = {
        id: Date.now(),
        nombre: nuevaTarea,
        duracion: parseInt(duracion, 10)
      };
      setTareas([...tareas, nuevaTareaObj]);
      setNuevaTarea('');
      setDuracion('');
    }
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter(t => t.id !== id));
  };

  return (
    <div className="container">
      <h1>Contador de Tareas</h1>
      
      <div className="form-card">
        <input 
          type="text" 
          value={nuevaTarea} 
          onChange={(e) => setNuevaTarea(e.target.value)} 
          placeholder="Nombre de la tarea" 
        />
        <input 
          type="number" 
          value={duracion} 
          onChange={(e) => setDuracion(e.target.value)} 
          placeholder="Duración (minutos)" 
        />
        <button onClick={agregarTarea}>Agregar tarea</button>
      </div>

      <div className="filter-section">
        <label>Filtrar por duración: </label>
        <select value={filtroDuracion} onChange={(e) => setFiltroDuracion(e.target.value)}>
          <option value="todas">Todas</option>
          <option value="cortas">15 min o menos</option>
          <option value="largas">Más de 15 min</option>
        </select>
      </div>

      <h2>Tareas</h2>
      <ul className="task-list">
        {tareasFiltradas.map((tarea) => (
          <li key={tarea.id} className="task-item">
            <span><strong>{tarea.nombre}</strong>: {tarea.duracion} min</span>
            <button className="delete-btn" onClick={() => eliminarTarea(tarea.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <div className="total-badge">
        Total de tiempo: {calcularTiempoTotal} minutos
      </div>
    </div>
  );
}

export default App;