from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        return super().end_headers()

port = 8000
print(f"Starting server at http://localhost:{port}")
HTTPServer(('localhost', port), CORSRequestHandler).serve_forever()
