# import datetime module:
from datetime import datetime

# output http header:
print('Content-type: text/html')
print('')
# note the empty print above is required!

# output web page content:
print('<html><head><meta charset="UTF-8"></head>')
print('<title>Server vs Client</title>')
print('</head><body>')
print('<h2>WELCOME...!</h2>')
print('Date/time at the server: <br>')
currentDateTime = datetime.today()
print(currentDateTime)
print('<hr>')
print('Date/time at the client: <br>')
print('<script language="javascript">')
print('   document.write(Date());')
print('</script>')
print('</body></html>')