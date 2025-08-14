from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
db_config = {
    'host': 'localhost',
    'user': 'root',          # Usuario por defecto de XAMPP
    'password': '',          # Contraseña por defecto (vacía en XAMPP)
    'database': 'control'  # Nombre de tu base de datos
}

@app.route('/api/python')
def index():
    return "Bienvenido a la API de consulta a MySQL"

@app.route('/consulta')
def consultar_datos():
    try:
        # Conectar a la base de datos
        conexion = mysql.connector.connect(**db_config)
        cursor = conexion.cursor(dictionary=True)  # dictionary=True para obtener resultados como diccionarios
        
        # Ejecutar consulta SQL
        consulta = "SELECT user, contra FROM usuario LIMIT 10"  # Cambia por tu consulta real
        cursor.execute(consulta)
        
        # Obtener resultados
        resultados = cursor.fetchall()
        
        # Cerrar conexión
        cursor.close()
        conexion.close()
        
        # Devolver resultados como JSON
        return jsonify({
            'status': 'success',
            'data': resultados
        })
        
    except mysql.connector.Error as err:
        return jsonify({
            'status': 'error',
            'message': f"Error de MySQL: {err}"
        }), 500

if __name__ == '__main__':
    app.run(debug=True)