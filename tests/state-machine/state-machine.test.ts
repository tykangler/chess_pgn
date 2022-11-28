import { StateMachine } from "state-machine/state-machine";
import { StateResult } from "state-machine/state-result";
import { Transition } from "state-machine/transition";

// #region setup

enum TestState {
    Begin,
    End,
    State1,
    State2,
    State3
};

const states: Transition<TestState, string>[] = [
    {
        srcState: TestState.Begin,
        transition: (input, ctx) => {
            if (input === "a") {
                return TestState.State1;
            } else if (input === "b") {
                return TestState.State2;
            } else {
                return TestState.State3;
            }
        }
    },
    {
        srcState: TestState.State1,
        transition: (input, ctx) => {
            if (input === "a") {
                return TestState.State2;
            } else if (input === "c") {
                return TestState.State1;
            } else {
                return TestState.End;
            }
        }
    },
    {
        srcState: TestState.State2,
        transition: (input, ctx) => {
            if (input === "d") {
                return TestState.State3
            } else {
                return TestState.End;
            }
        }
    },
    {
        srcState: TestState.State3,
        transition: (input, ctx) => {
            if (input === "e") {
                return TestState.End;
            } else if (input === "a") {
                return TestState.State1;
            } else {
                return TestState.Begin;
            }
        }
    }
];

// #endregion

function initStateMachine(s: string): StateMachine<TestState, string> {
    return new StateMachine<TestState, string>(s, TestState.Begin, states);
}

function stateTransitionsMatchExpectedStates(input: string, expectedStates: TestState[]) {
    const stateMachine = initStateMachine(input);
    for (const expectedState of expectedStates) {
        const { state } = stateMachine.transition();
        expect(state).toBe(expectedState);
    }
}

describe("State Machine correctly transitions states", () => {
    test("Begin -> State1 -> State2 -> State3 -> End", () => {
        const s = "aade";
        const expectedStates = [TestState.State1, TestState.State2, TestState.State3, TestState.End];
        stateTransitionsMatchExpectedStates(s, expectedStates);
    });

    test("Begin -> State2 -> End", () => {
        const s = "bf";
        const expectedStates = [TestState.State2, TestState.End];
        stateTransitionsMatchExpectedStates(s, expectedStates);
    });

    test("Begin -> State1 -> State1 -> State2 -> State3 -> Begin -> State2 -> End", () => {
        const s = "acadfbz";
        const expectedStates = [
            TestState.State1, TestState.State1, TestState.State2, TestState.State3, TestState.Begin,
            TestState.State2, TestState.End
        ];
        stateTransitionsMatchExpectedStates(s, expectedStates);
    });
});