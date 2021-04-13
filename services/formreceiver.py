# import cgi module:
import cgi

# output http header:
print('Content-type: text/html')
print('')
# note the empty print above is required!

print('<html><head><title>Python Test</title></head>')
print('<body>')

theRequest = cgi.FieldStorage()
theName = theRequest.getfirst("form.html", "undefined")

print('</body></html>')