import { createSlice } from "@reduxjs/toolkit";

const moduleSlice = createSlice({
    name: "module",
    initialState: {
        moduleData: [],
        expandedModules: {},
        loading: false
    },
    reducers: {
        setModuleData: (state, action) => {
            state.moduleData = action.payload;
        },
        addModule: (state, action) => {
            state.moduleData.push(action.payload);
        },
        updateModule: (state, action) => {
            const index = state.moduleData.findIndex(m => m._id === action.payload._id);
            if (index !== -1) {
                state.moduleData[index] = action.payload;
            }
        },
        removeModule: (state, action) => {
            state.moduleData = state.moduleData.filter(m => m._id !== action.payload);
        },
        toggleModuleExpand: (state, action) => {
            const moduleId = action.payload;
            state.expandedModules[moduleId] = !state.expandedModules[moduleId];
        },
        setAllExpanded: (state, action) => {
            state.moduleData.forEach(m => {
                state.expandedModules[m._id] = action.payload;
            });
        },
        addLectureToModule: (state, action) => {
            const { moduleId, lecture } = action.payload;
            const module = state.moduleData.find(m => m._id === moduleId);
            if (module) {
                if (!module.lectures) module.lectures = [];
                module.lectures.push(lecture);
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const {
    setModuleData,
    addModule,
    updateModule,
    removeModule,
    toggleModuleExpand,
    setAllExpanded,
    addLectureToModule,
    setLoading
} = moduleSlice.actions;

export default moduleSlice.reducer;
