import * as dgraph from 'dgraph-js-http';

class GameListModel {
    dgraphClient: dgraph.DgraphClient;

    constructor() {
        const clientStub = new dgraph.DgraphClientStub('http://localhost:8080');
        this.dgraphClient = new dgraph.DgraphClient(clientStub);
    }

    async getList(username: string, status: string) {
      // TODO: pass status variable through query params instead of through template literal
      const GET_LIST = `query gameList($userName: string) {
        playingList(func: eq(User.username, $userName)) {
          ${status} @facets {
            uid
            Game.title
          }
        }
      }`;

      const vars = { $userName: username };
      const res: any = await this.dgraphClient.newTxn().queryWithVars(GET_LIST, vars);
      return res.data[`${status}List`][0][`${status}`] || [];
    }
}

export { GameListModel };
