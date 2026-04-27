# Tripleten web_project_around_express

## DESCRIPCIÓN

Este es un proyecto que tiene como abjetivo el crear un servidor para mostrar información en el navegar del lado del Back-end. Dependiendo de las solicitudes que relice el usuario, por el momento está desarrollada para los enpoint http://localhost:3000, httt: http://localhost:3000/cards, http://localhost:3000/users, http://localhost:3000/users/(id aquí), los datos recibidos están almacenados en archivos de manera local para este ejemplo, Estos están el archivo cards.json y users.json, cuando se hacer una solicitud a un enpoint que no tiene nada nos devolverá un error 404 personalizado, que nos da un mensaje claro del error.

## FUNCIONALIDAD

La página tiene la función principal de mostrar información que se obtiene de las peticiones que hacemos al servidor al procesar esta información se procede a mostrar los resultados, según el enlace que realice el usuario.

Administrar las solicitudes que realiza el usuario y devolver su respectiva respuesta

## CARACTERÍSTICAS

## PROPÓSITOS

El propósito es tener una idea de cómo se hace un servidor con express.js y cómo generar las diferente solicitudes para acceder a la información que está en nuestro Back-end, también cómo hacer enrrutamientos, y el enfoque modular a la hora de estructurar el sistema de archivos de un proyecto en nuestro futuro.

## TÉCNICAS Y TECNOLOGÍAS UTILIZADAS

Está desarrollado utilizando las tecnologías como Node.js y Express.js para crear el servidor, se utiliza un enfoque modular para el sistema de archivos, se crear un enrrutamiento utilizando el método de **Router()**, se leen los archivos utilizando el método **fs** con su función **readFile()** y para las respuesta se usa **res.JSON.parse((data))** para parcear los datos y poder enviar la respuesta con los datos completos, utilizamos el puerto **3000** para poder acceder a este proyecto, Para realizar pruebas con las peticiones se utilizón **Postman** con el propósito de poder ver las diferentes respuestas que nos da el servidor.

## ## ENLACES
