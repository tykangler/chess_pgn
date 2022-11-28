export type StateResult<StateType> = {
    done: boolean;
    state: StateType | null;
};