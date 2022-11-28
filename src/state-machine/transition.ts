import { StateMachine } from "./state-machine";

export type Transition<StateType, InputType> = {
    srcState: StateType;
    transition: (input: InputType, ctx: StateMachine<StateType, InputType>) => StateType | null;
};