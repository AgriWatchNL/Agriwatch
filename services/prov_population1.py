import cgi
import cgitb
cgitb.enable()
import json
import psycopg2
from psycopg2.extras import RealDictCursor


params = cgi.FieldStorage()
country_name = params.getvalue("country_name")

 
pg = psycopg2.connect("dbname='exercises' host='gisedu.itc.utwente.nl' port='5432' \
                       user='exercises' password='exercises'")
 
dataQuery = "WITH p AS \
               (SELECT avg(pop_admin) as avg FROM world.prov_pop where cntry_name = '%s') \
             SELECT gid AS id, admin_name as prov_name, admin_code as prov_abbr, \
                   trim(to_char(pop_admin,'9999999999D99'))::real AS pop, \
                   trim(to_char((pop_admin-p.avg)/1000000,'99999999D9999'))::real AS popdev \
             FROM world.prov_pop, p \
             WHERE cntry_name = '%s' \
             ORDER BY 3;" % (country_name, country_name)
 
records_query = pg.cursor(cursor_factory=RealDictCursor)
records_query.execute(dataQuery)
 
result = json.dumps(records_query.fetchall())
 
print ("Content-type: application/json; charset=utf-8")
print ()
print (result.replace("'",'"'))