# Weather-Update

1. Initially was going to run on Firebase functions as a scheduled job, to be completely server less. However, due to amount of invocations and time running can see this becoming    costly solution for a very simple task.
2. It currently gets all the cities from the city table in Firebase.
3. It then queries the endpoint at https:\\api.openweathermap.org//data/2.5/forecast/daily?units=metric&cnt=7&appid= &id=
4. Where id is the city id. 
5. Note: As there are approx. 5000 cities I need to make 5000 get requests. 
6. Don’t want to make them all once, as would get blocked by the service provider and possibly timeout.
7. Solution was make get requests with one concurrent connection. Meaning one after the other, to prevent timeout and getting blocked. 
8. When the response was provided this updated an object. Once all requests were made, the object updated Firebase with the new weather data. 

### Installing
Won't be much use installing this repo, as won't work without the config file.
