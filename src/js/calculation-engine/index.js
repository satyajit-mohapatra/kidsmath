(function(global) {
    'use strict';

    const StepDataStructure = global.StepDataStructure;

    const AdditionMethods = {
        standard: global.StandardAddition,
        kahan: global.KahanSummation,
        carryLookahead: global.CarryLookahead
    };

    const SubtractionMethods = {
        standard: global.StandardSubtraction,
        twosComplement: global.TwosComplement
    };

    const MultiplicationMethods = {
        gradeSchool: global.GradeSchoolMultiplication,
        vedicNikhilam: global.VedicNikhilam,
        vedicUrdhvaTiryak: global.VedicUrdhvaTiryak,
        vedicEkadhikena: global.VedicEkadhikena,
        lattice: global.LatticeMultiplication,
        russianPeasant: global.RussianPeasant,
        abacus: global.AbacusMethods,
        karatsuba: global.Karatsuba
    };

    const DivisionMethods = {
        longDivision: global.LongDivision,
        vedicParavartya: global.VedicParavartya,
        synthetic: global.SyntheticDivision,
        nonRestoring: global.NonRestoringDivision,
        newtonRaphson: global.NewtonRaphson
    };

    const VisualizationUtils = {
        grid: global.GridRenderer,
        column: global.ColumnRenderer,
        binary: global.BinaryRenderer
    };

    const CalculationEngine = {
        StepDataStructure,
        AdditionMethods,
        SubtractionMethods,
        MultiplicationMethods,
        DivisionMethods,
        VisualizationUtils,
        getMethod(operation, methodType) {
            const methods = {
                addition: AdditionMethods,
                subtraction: SubtractionMethods,
                multiplication: MultiplicationMethods,
                division: DivisionMethods
            };
            return methods[operation]?.[methodType] || null;
        },
        getAllMethods(operation) {
            const methods = {
                addition: AdditionMethods,
                subtraction: SubtractionMethods,
                multiplication: MultiplicationMethods,
                division: DivisionMethods
            };
            return methods[operation] || {};
        },
        getMethodList(operation) {
            const methods = this.getAllMethods(operation);
            return Object.entries(methods).map(([key, module]) => ({
                id: key,
                ...module.METHOD_METADATA
            })).sort((a, b) => a.displayOrder - b.displayOrder);
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CalculationEngine;
    }

    global.CalculationEngine = CalculationEngine;

})(typeof window !== 'undefined' ? window : this);
