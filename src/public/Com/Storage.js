import {
    AsyncStorage
} from 'react-native'

var Storage = {
    SaveItem(key,vaule){
        Storage.removeItem(key);
        AsyncStorage.setItem(key,JSON.stringify(vaule));
    },
    removeItem(key){
        AsyncStorage.removeItem(key);
    },
    getItem(key,callback){
        AsyncStorage.getItem(key)
            .then((result)=>{
                if (result == null) {
                    console.log('没有指定的key对应的值');
                    return;
                }
                //console.log(key + ' : ' + result);
                if (callback) {
                    callback(JSON.parse(result));
                }
            })
            .catch((error)=>{
                let err =  'error: ' + error.message;
                //console.log(err);
                if (callback) {
                    callback(err);
                }
            });
    },
    getAllData(callback){
        AsyncStorage.getAllKeys((err,keys)=>{
            AsyncStorage.multiGet(keys,(err,stores)=>{
                let dataArr = [];
                stores.map((result,i,store)=>{
                    //有待改善
                    if (store[i][0] != 'canShowNecessaryInstall' && store[i][0] != 'installIntegrateAppData' && store[i][0] != 'prtimekey' && store[i][0] != 'VipValidTime') {
                        let key = store[i][0];
                        let value = store[i][1];
                        //console.log('存储结果' + i + ':' + store);
                        dataArr.push(store[i]);
                    }
                });
                if (callback) {callback(dataArr)}
            });
        });
    },
    removeAllData(){
        AsyncStorage.getAllKeys((err,keys)=>{
            let filterKeys = []
            //有待改善
            keys.map((key, i) => {
                if (key != 'canShowNecessaryInstall' && key != 'installIntegrateAppData' && key != 'prtimekey' && key != 'VipValidTime') {
                    filterKeys.push(key)
                }
            })
            AsyncStorage.multiRemove(filterKeys,(err)=>{

            });
        });
    }
}

export default Storage
