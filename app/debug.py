import uvicorn
import coloredlogs

from app.server import app

if __name__ == '__main__':
    coloredlogs.install(level="DEBUG")
    app.debug = True

    config = uvicorn.Config(app=app, host='127.0.0.1', port=8089)
    server = uvicorn.Server(config)
    server.run()
