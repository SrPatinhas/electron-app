<script>
    //https://github.com/louischatriot/nedb
    import Datastore from 'nedb';
    import path from 'path';
    import { remote } from 'electron';
    import fs from 'fs';
    /*
        export default new Datastore({
            autoload: true,
            filename: path.join(basepath, '/data/settings.db')
        });
        basepath = remote.app.getPath('userData') + '\\data\\';
        console.log(basepath);

        var file_structure = {
            created_at: new Date(),
            uploaded: true,
            uploaded_at: new Date(),
            name: "name of file",
            type: "movie",
            path: 'path/to/file.mp4',
            subtitles: {
                eng: "path/to/file.str",
                fre: "path/to/file.str",
                por: "path/to/file.str",
                deu: "path/to/file.str",
                ita: "path/to/file.str",
                spa: "path/to/file.str",
                ell: "path/to/file.str",
                pol: "path/to/file.str"
            }
        };

        var settings_structure = {
            paths: {
                app: null,
                desktop: null,
                downloads: null,
            },
        };
        db_test = new Datastore({ filename: './data/settings.json', autoload: true });
        var doc = 	{
                        name: 'product001',
                        quantity : 100
                    };
        db_test.insert(doc, function (err, newDoc) {
          // newDoc is the newly inserted document
              console.log("DB: Test New");
              console.log(newDoc);
        });
        db_test.find({ name: 'product001' }, function (err, docs) {
              // results
              console.log("DB: Test find");
              console.log(docs);
        });
    */

    export default {
        name: 'db_app',
        data () {
            return {
                dir_BD: './data/',
                settings: null,
                tables: [],
                settings_structure: {
                    paths: {
                        app: remote.app.getPath("userData"),
                        desktop: remote.app.getPath("desktop"),
                        downloads: remote.app.getPath("downloads"),
                    },
                    autoUpdate: true,
                    keepDownloads: true,
                    plugins: {},
                },
                file_structure: {
                    created_at: new Date(),
                    uploaded: true,
                    uploaded_at: new Date(),
                    name: "name of file",
                    type: "movie",
                    path: 'path/to/file.mp4',
                    subtitles: {
                        eng: "path/to/file.str",
                        fre: "path/to/file.str",
                        por: "path/to/file.str",
                        deu: "path/to/file.str",
                        ita: "path/to/file.str",
                        spa: "path/to/file.str",
                        ell: "path/to/file.str",
                        pol: "path/to/file.str"
                    }
                },
            }
        },
        methods: {
            getDB(table) {
                if(!this.tables.includes(table)) {
                    this.tables.push(table);
                }
                if(this.tables[table] == undefined){
                    if (!fs.existsSync(this.dir_BD)){
                        fs.mkdirSync(this.dir_BD);
                    }
                    this.tables[table] = new Datastore({
                        filename: this.dir_BD + table + '.db',
                        autoload: true
                    });
                }
            },
            insertInDB(table, data){
                this.tables[table].insert(data, function (err, newDoc) {   // Callback is optional
                    // newDoc is the newly inserted document, including its _id
                    // newDoc has no key called notToBeSaved since its value was undefined
                    console.log("Table: " + table);
                    console.log("New Record Saved.");
                    console.log(newDoc);
                });
            },
            findOneInDB(table, field, value){
                // The same rules apply when you want to only find one document
                this.tables[table].findOne({ field: value }, function (err, doc) {
                    // doc is the document Mars
                    // If no document is found, doc is null
                });
            },
            findInDB(table, field, value){
                // Finding all planets in the solar system
                this.tables[table].find({ field: value }, function (err, docs) {
                    // docs is an array containing documents Mars, Earth, Jupiter
                    // If no document is found, docs is equal to []
                });
            },
            findAllInDB(table, field, value){
                // Finding all planets in the solar system
                this.tables[table].find({}, function (err, docs) {

                });
            },
            deleteInDB(table, field, value, multi = false){
                // Remove one document from the collection
                // options set to {} since the default for multi is false
                this.tables[table].remove({ field: value }, {multi: multi}, function (err, numRemoved) {
                    // multi: false = numRemoved = 1
                    // multi: true = numRemoved = 3
                    // All planets from the solar system were removed
                });
            },
            deleteFileInDB(table, field, value, multi = false){
                // Removing all documents with the 'match-all' query
                this.tables[table].remove({}, { multi: true }, function (err, numRemoved) {
                });
            },

            loadSettingsDB() {
                let self = this;
                console.log(self);
                if(!self.tables.includes('settings') || self.tables['settings'] == undefined) {
                    self.getDB('settings');
                }
                self.tables['settings'].count({}, function (err, count) {
                    // count equals to 4
                    console.log("DB: Settings Count");
                    console.log(count);

                    if(count == 0){
                        self.insertInDB('settings', self.settings_structure);
                    }
                    self.tables['settings'].findOne({}, function (err, doc) {
                        self.settings = doc;
                        console.log(self.settings);
                    });
                });
            }
        },
        created(){
            this.loadSettingsDB();
        },
    }
</script>