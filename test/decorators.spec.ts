import {Err} from "../src/decorators/error";
import {Location} from "../src/decorators/location";
import Chai = require("chai");
import InjectParams from "../src/services/inject-params";
import {
    EXPRESS_ERR, ENDPOINT_USE, ENDPOINT_USE_BEFORE, ENDPOINT_USE_AFTER, CONTROLLER_SCOPE
} from "../src/constants/metadata-keys";
import Metadata from "../src/services/metadata";
import {Redirect} from "../src/decorators/redirect";
import {Header} from "../src/decorators/header";
import {Scope} from "../src/decorators/controller";

let expect: Chai.ExpectStatic = Chai.expect;

class TestDecorator{
    method(){}
    methodNothing(){}
}

describe('Decorators :', () => {

    describe('@Err()', () => {
        
        it('should add metadata', () => {
            Err()(TestDecorator, 'method', 0);
            const params = InjectParams.get(TestDecorator, 'method', 0);

            expect(params.service).to.equal(EXPRESS_ERR);
        });
        
    });

    describe('@Location()', () => {

        it('should add metadata', () => {
            Location('http://test')(TestDecorator, 'method', {});
            const response = {
                l: '',
                location: (e) => {
                    response.l = e;
                }
            };

            const middlewares = Metadata.get(ENDPOINT_USE_AFTER, TestDecorator, 'method');

            expect(middlewares.length).to.equal(1);

            const middleware = middlewares[0];

            middleware({}, response, () => {});

            expect(response.l).to.equal('http://test');

            Metadata.set(ENDPOINT_USE_AFTER, [], TestDecorator, 'method');
        });



    });

    describe('@Redirect()', () => {

        it('should add metadata', () => {
            Redirect('http://test')(TestDecorator, 'method', {});

            const response = {
                l: '',
                redirect: (e) => {
                    response.l = e;
                }
            };

            const middlewares = Metadata.get(ENDPOINT_USE_AFTER, TestDecorator, 'method');

            expect(middlewares.length).to.equal(1);

            const middleware = middlewares[0];

            middleware({}, response, () => {});

            console.log(response);
            expect(response.l).to.equal('http://test');

            Metadata.set(ENDPOINT_USE, [], TestDecorator, 'method');
        });

        it('should add metadata', () => {
            Redirect(200, 'http://test')(TestDecorator, 'method', {});

            const response = {
                l: '',
                redirect: (e) => {
                    response.l = e;
                }
            };

            const middlewares = Metadata.get(ENDPOINT_USE_AFTER, TestDecorator, 'method');

            expect(middlewares.length).to.equal(2);

            const middleware = middlewares[0];

            middleware({}, response, () => {});

            console.log(response);
            expect(response.l).to.equal(200);

            Metadata.set(ENDPOINT_USE, [], TestDecorator, 'method');
        });

    });

    describe('@Header()', () => {

        it('should do nothing', () => {
            Header({'Content-Type': 'application/json'})(TestDecorator, 'methodNothing', {});

            const response = {
                headersSent: true
            };

            const middlewares = Metadata.get(ENDPOINT_USE_AFTER, TestDecorator, 'methodNothing');
            const middleware = middlewares[0];

            let called = false;

            middleware({}, response, () => {called = true});

            expect(called).to.be.true;

            Metadata.set(ENDPOINT_USE_AFTER, [], TestDecorator, 'methodNothing');
        });

        it('should add metadata (object)', () => {
            Header({'Content-Type': 'application/json'})(TestDecorator, 'method', {});

            const response = {
                l: {},
                set: (k, v) => {
                    response.l[k] = v;
                }
            };

            const middlewares = Metadata.get(ENDPOINT_USE_AFTER, TestDecorator, 'method');

            expect(middlewares.length).to.equal(3);

            const middleware = middlewares[0];

            middleware({}, response, () => {});

            expect(JSON.stringify(response.l)).to.equal('{"Content-Type":"application/json"}');

            Metadata.set(ENDPOINT_USE_AFTER, [], TestDecorator, 'method');
        });

        it('should add metadata (params)', () => {
            Header('Content-Type', 'application/json')(TestDecorator, 'method', {});

            const response = {
                l: {},
                set: (k, v) => {
                    response.l[k] = v;
                }
            };

            const middlewares = Metadata.get(ENDPOINT_USE_AFTER, TestDecorator, 'method');

            expect(!!middlewares.length).to.equal(true);

            const middleware = middlewares[0];

            middleware({}, response, () => {});

            expect(JSON.stringify(response.l)).to.equal('{"Content-Type":"application/json"}');

            Metadata.set(ENDPOINT_USE_AFTER, [], TestDecorator, 'method');
        });

    });

    describe('@Scope()', () => {
        it('should add metadata', () => {

            Scope(TestDecorator);
            expect(Metadata.get(CONTROLLER_SCOPE, TestDecorator)).to.be.true;

        });
    });
});