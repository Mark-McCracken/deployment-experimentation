import { Test } from "@nestjs/testing";
import { OnlyController } from "./only.controller";

describe('OnlyController', () => {
    let onlyController: OnlyController;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [OnlyController]
        }).compile();

        onlyController = module.get<OnlyController>(OnlyController);
    });

    describe('Real Tests', () => {
        it('Should return status ok for health check', () => {
            expect(onlyController.healthCheck()).toEqual({"status": "ok"});
        });

        it('Should return status ok after a wait for latency', async (done) => {
            const start = new Date().getTime();
            const response = await onlyController.getLatencyEndpoint();
            const end = new Date().getTime();
            const duration = end - start;
            expect(response).toEqual({"status": "ok"});
            expect(duration).toBeGreaterThan(100);
            expect(duration).toBeLessThan(2500);
            done();
        });

        it("Should fail sometimes for errors", () => {
            const attempts = 10;
            let successes = 0;
            let fails = 0;
            for (var i=1; i <= attempts; i++) {
                try {
                    onlyController.getErrorsEndpoint();
                    successes++;
                } catch {
                    fails++;
                }
            }
            expect(successes).toBeGreaterThan(0);
            expect(successes).toBeLessThan(attempts);
            expect(fails).toBeGreaterThan(0);
            expect(fails).toBeLessThan(attempts);
            expect(successes + fails).toEqual(attempts);
        })
    });

    describe('Random Fail Test', () => {
        it("Should fail 40% of the time", () => {
            expect(Math.random() > 0.4).toBe(true);
        })
    })

});
