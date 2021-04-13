import cgi
import json
import psycopg2
from psycopg2.extras import RealDictCursor
 
pg = psycopg2.connect("dbname='exercises' host='gisedu.itc.utwente.nl' port='5432' \
                       user='exercises' password='exercises'")
 
dataQuery = "WITH p AS \
               (SELECT avg(aantal_inw) as avg FROM netherlands.province where water = 'NEE') \
             SELECT prov_id AS id, prov_name, prov_abbr, \
                   trim(to_char(aantal_inw,'9999999999D99'))::real AS pop, \
                   trim(to_char((aantal_inw-p.avg)/1000000,'99999999D9999'))::real AS popdev \
             FROM netherlands.province, p \
             WHERE water = 'NEE' \
             ORDER BY 3;"
 
records_query = pg.cursor(cursor_factory=RealDictCursor)
records_query.execute(dataQuery)
 
result = json.dumps(records_query.fetchall())
 
print ("Content-type: application/json; charset=utf-8")
print ()
print (result.replace("'",'"'))