import Folder from "model/folder";
import MockAdapter from "axios-mock-adapter";
import Api from "common/api";

let chai = require("chai/chai");
let assert = chai.assert;

const mock = new MockAdapter(Api);

mock
    .onGet("folders/2011/10-Halloween", {"params": {"recursive": true, "uncached": true}}, {"x-count": "12", "x-limit": "100", "x-offset": "0"}).reply(200, {folders: [1, 2], files: [1]});


describe.only("model/folder", () => {

    it("should get folder defaults",  () => {
        const values = {
            Folder: true,
            Path: "2011/10-Halloween",
            Root: "",
            UID: "dqbevau2zlhxrxww",
            Type: "",
            Title: "Halloween Party",
            Category: "",
            Description: "",
            Order: "",
            Country: "",
            Year: "",
            Month: "",
            Favorite: false,
            Private: false,
            Ignore: false,
            Watch: false,
            FileCount: 0,
            CreatedAt: "",
            UpdatedAt: "",
        };
        const model = new Folder(values);
        const result = model.getDefaults();
        assert.equal(result.Folder, true);
        assert.equal(result.Path, "");
        assert.equal(result.Favorite, false);
    });

    it("should get folder base name",  () => {
        const values = {
            Folder: true,
            Path: "2011/10-Halloween",
            Root: "",
            UID: "dqbevau2zlhxrxww",
            Type: "",
            Title: "Halloween Party",
            Category: "",
            Description: "",
            Order: "",
            Country: "",
            Year: "",
            Month: "",
            Favorite: false,
            Private: false,
            Ignore: false,
            Watch: false,
            FileCount: 0,
            CreatedAt: "",
            UpdatedAt: "",
        };
        const folder = new Folder(values);
        const result = folder.baseName();
        assert.equal(result, "10-Halloween");
        const result2 = folder.baseName(8);
        assert.equal(result2, "10-Ha...");
    });

    it("should return false",  () => {
        const values = {
            Folder: true,
            Path: "2011/10-Halloween",
            UID: "dqbevau2zlhxrxww",
            Title: "Halloween Party",
        };
        const folder = new Folder(values);
        assert.equal(folder.isFile(), false);
    });

    it("should return entity name",  () => {
        const values = {
            Folder: true,
            Path: "2011/10-Halloween",
            Root: "",
            UID: "dqbevau2zlhxrxww",
            Title: "Halloween Party",
        };
        const folder = new Folder(values);
        assert.equal(folder.getEntityName(), "/2011/10-Halloween");
    });

    it("should return thumbnail url",  () => {
        const values = {
            Folder: true,
            Path: "2011/10-Halloween",
            Root: "",
            UID: "dqbevau2zlhxrxww",
            Title: "Halloween Party",
        };
        const folder = new Folder(values);
        assert.equal(folder.thumbnailUrl(), "/api/v1/svg/folder");
    });

    it("should get date string",  () => {
        const values = {
            Folder: true,
            Path: "2011/10-Halloween",
            Root: "",
            UID: "dqbevau2zlhxrxww",
            Title: "Halloween Party",
            CreatedAt: "2012-07-08T14:45:39Z",
            UpdatedAt: "2012-07-08T14:45:39Z",
        };
        const folder = new Folder(values);
        assert.equal(folder.getDateString(), "Jul 8, 2012, 2:45 PM");
    });

    it("should toggle like",  () => {
        const values = {
            Folder: true,
            Path: "2011/10-Halloween",
            Root: "",
            UID: "dqbevau2zlhxrxww",
            Title: "Halloween Party",
            Favorite: true,
            Private: true,
        };
        const folder = new Folder(values);
        assert.equal(folder.Favorite, true);
        folder.toggleLike();
        assert.equal(folder.Favorite, false);
        folder.toggleLike();
        assert.equal(folder.Favorite, true);
    });

    it("should like folder",  () => {
        const values = {
            Folder: true,
            Path: "2011/10-Halloween",
            Root: "",
            UID: "dqbevau2zlhxrxww",
            Title: "Halloween Party",
            Favorite: false,
            Private: true,
        };
        const folder = new Folder(values);
        assert.equal(folder.Favorite, false);
        folder.like();
        assert.equal(folder.Favorite, true);
    });

    it("should unlike folder",  () => {
        const values = {
            Folder: true,
            Path: "2011/10-Halloween",
            Root: "",
            UID: "dqbevau2zlhxrxww",
            Title: "Halloween Party",
            Favorite: true,
            Private: true,
        };
        const folder = new Folder(values);
        assert.equal(folder.Favorite, true);
        folder.unlike();
        assert.equal(folder.Favorite, false);
    });

    it("should get collection resource",  () => {
        const result = Folder.getCollectionResource();
        assert.equal(result, "folders");
    });

    it("should get model name",  () => {
        const result = Folder.getModelName();
        assert.equal(result, "Folder");
    });

    it("should test search",  (done) => {
        Folder.search("2011/10-Halloween",{recursive: true, uncached: true}).then(
            (response) => {
                console.log(response);
                assert.equal(response.status, 200);
                assert.equal(response.count, 3);
                assert.equal(response.folders, 2);
                done();
            }
        ).catch(
            (error) => {
                done(error);
            }
        );
    });

});