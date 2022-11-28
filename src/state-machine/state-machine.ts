import { StateResult } from "./state-result";
import { Transition } from "./transition";

export class StateMachine<StateType, InputType> {
    private _history: StateType[];
    private _currentState: StateType;
    private _done: boolean;
    private readonly _input: Iterator<InputType>
    // unlikely to have many transitions, so use plist of transitions which is faster than hashtable
    public readonly transitions: Transition<StateType, InputType>[];

    constructor(
        input: Iterable<InputType>,
        initialState: StateType,
        stateTransitions: Transition<StateType, InputType>[]) {
        this._currentState = initialState;
        this._history = [];
        this._input = input[Symbol.iterator]();
        this.transitions = stateTransitions;
    }

    public get history(): StateType[] {
        return this._history;
    }

    public get done(): boolean {
        return this._done;
    }

    // transitions to next state given next input in iterable and current state.
    // if iterable is done, returns { done: true, state: null };
    // if no transition found with source state equal to current state, returns { done: false, state: null }
    // if the transition returns null, this will be treated as invalid state. returns { done: false, state: null }
    // if a valid non-null transition found, returns { done: false, state: state };
    public transition(): StateResult<StateType> {
        if (this._done) {
            return { done: true, state: null };
        }
        let currValue = this._input.next();
        if (currValue.done) {
            this._done = true;
            return { done: true, state: null };
        }
        let transition = this.transitions.find(t => t.srcState === this._currentState);
        if (!transition) {
            return { done: false, state: null };
        } else {
            let dstState = transition.transition(currValue.value, this);
            if (dstState === null) {
                return { done: false, state: null };
            }
            this._history.push(this._currentState);
            this._currentState = dstState;
            return { done: false, state: dstState };
        }
    }
}