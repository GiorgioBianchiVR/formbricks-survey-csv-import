import { main } from "../index";

describe("Main Functions", () => {
    describe("createSurvey", () => {
        it("should not throw if API key is present and valid and csv is parsed correctly", () => {
            expect(() => main()).not.toThrow();
        });

    });
});