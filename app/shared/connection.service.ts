import * as connectivity from "tns-core-modules/connectivity";

/**
 * Created by rakesh on 15-Nov-2017.
 */
export class ConnectionService {

    static connected: boolean = true;

    static getInstance(): ConnectionService {
        return ConnectionService._instance;
    }

    private static _instance: ConnectionService = new ConnectionService();

    constructor() {
        connectivity.startMonitoring((newConnectionType) => {
            switch (newConnectionType) {
                case connectivity.connectionType.none:
                    ConnectionService.connected = false;
                    break;
                case connectivity.connectionType.wifi:
                    ConnectionService.connected = true;
                    break;
                case connectivity.connectionType.mobile:
                    ConnectionService.connected = true;
                    break;
            }
        });
    }

    isConnected(): boolean {
        return ConnectionService.connected;
    }
}
