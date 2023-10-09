class API {
  async makeRequest(path) {
    // let baseUrl = "http://localhost:3000/";
    // const URL = "http://192.168.86.22:3000/";
    const URL =
      process.env.NODE_ENV == "production"
        ? "http://localhost:3000/"
        : `http://${window.location.hostname}:3000/`;

    let response = await fetch(`${URL}${path}`);
    let data = await response.json();
    return data;
  }

  async createGame() {
    let path = "create-game";
    return this.makeRequest(path);
  }

  async roomIsActive(room) {
    let path = `is-active-room/${room}`;
    return this.makeRequest(path);
  }

  async nameExists(request) {
    let path = `name-exists/${request.room}/${request.name}`;
    return this.makeRequest(path);
  }
}

export default new API();
