(function(global) {
    'use strict';

    const GridRenderer = {
        renderLatticeGrid(dimensions, cellData) {
            const { rows, cols } = dimensions;
            let html = `<div class="lattice-grid" style="display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 4px; max-width: 300px; margin: 20px auto;">`;
            
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const cell = cellData[r]?.[c] || { tens: 0, ones: 0 };
                    html += `
                        <div class="lattice-cell" style="
                            width: 60px;
                            height: 60px;
                            position: relative;
                            border: 2px solid #6c5ce7;
                            border-radius: 8px;
                            overflow: hidden;
                        ">
                            <div class="lattice-tens" style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 50%;
                                background: rgba(108, 92, 231, 0.1);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: bold;
                                color: #6c5ce7;
                            ">${cell.tens || ''}</div>
                            <div class="lattice-ones" style="
                                position: absolute;
                                bottom: 0;
                                right: 0;
                                width: 100%;
                                height: 50%;
                                background: rgba(0, 184, 148, 0.1);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: bold;
                                color: #00b894;
                            ">${cell.ones || ''}</div>
                            <div class="lattice-diagonal" style="
                                position: absolute;
                                top: 50%;
                                left: 0;
                                width: 100%;
                                height: 2px;
                                background: #2d3436;
                                transform: rotate(-45deg);
                                transform-origin: center;
                            "></div>
                        </div>
                    `;
                }
            }
            html += '</div>';
            return html;
        },

        renderPeasantTable(rows) {
            let html = `<table class="peasant-table" style="margin: 20px auto; border-collapse: collapse; font-family: monospace;">`;
            html += `<tr style="background: #f5f6fa;"><th style="padding: 8px; border: 1px solid #dfe6e9;">Left</th><th style="padding: 8px; border: 1px solid #dfe6e9;">Right</th><th style="padding: 8px; border: 1px solid #dfe6e9;">Keep?</th></tr>`;
            
            rows.forEach((row, index) => {
                const bgColor = row.isOdd ? 'rgba(0, 184, 148, 0.1)' : '#ffffff';
                const checkmark = row.isOdd ? '✓' : '';
                html += `<tr style="background: ${bgColor};">
                    <td style="padding: 8px; border: 1px solid #dfe6e9;">${row.left}</td>
                    <td style="padding: 8px; border: 1px solid #dfe6e9;">${row.right}</td>
                    <td style="padding: 8px; border: 1px solid #dfe6e9; text-align: center;">${checkmark}</td>
                </tr>`;
            });
            html += '</table>';
            return html;
        },

        renderAbacus(beads, abacusType = 'soroban') {
            const numRods = beads.length;
            let html = `<div class="abacus" style="display: flex; flex-direction: column; gap: 2px; padding: 20px; background: #f5f6fa; border-radius: 10px; max-width: 400px; margin: 20px auto;">`;
            
            for (let r = 0; r < numRods; r++) {
                const rod = beads[r];
                html += `<div class="rod" style="display: flex; align-items: center; gap: 8px; padding: 4px; background: white; border-radius: 4px;">`;
                
                if (abacusType === 'suapan') {
                    html += `<div class="upper-beads" style="display: flex; gap: 2px;">`;
                    for (let i = 0; i < 2; i++) {
                        const active = i < rod.upper;
                        html += `<div class="bead" style="
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            background: ${active ? '#e84393' : '#dfe6e9'};
                            border: 2px solid ${active ? '#d63031' : '#b2bec3'};
                        "></div>`;
                    }
                    html += `</div>`;
                } else {
                    html += `<div class="heaven-bead" style="
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        background: ${rod.heaven ? '#e84393' : '#dfe6e9'};
                        border: 2px solid ${rod.heaven ? '#d63031' : '#b2bec3'};
                    "></div>`;
                }
                
                html += `<div class="rod-bar" style="flex: 1; height: 4px; background: #636e72;"></div>`;
                
                if (abacusType === 'suapan') {
                    html += `<div class="lower-beads" style="display: flex; gap: 2px;">`;
                    for (let i = 0; i < 5; i++) {
                        const active = i < rod.lower;
                        html += `<div class="bead" style="
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            background: ${active ? '#0984e3' : '#dfe6e9'};
                            border: 2px solid ${active ? '#74b9ff' : '#b2bec3'};
                        "></div>`;
                    }
                    html += `</div>`;
                } else {
                    html += `<div class="earth-beads" style="display: flex; gap: 2px;">`;
                    for (let i = 0; i < 4; i++) {
                        const active = i < rod.earth;
                        html += `<div class="bead" style="
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            background: ${active ? '#0984e3' : '#dfe6e9'};
                            border: 2px solid ${active ? '#74b9ff' : '#b2bec3'};
                        "></div>`;
                    }
                    html += `</div>`;
                }
                
                html += `</div>`;
            }
            html += '</div>';
            return html;
        },

        renderSyntheticDivision(coeffs, results, c) {
            let html = `<div class="synthetic-division" style="padding: 20px; background: #f5f6fa; border-radius: 10px; max-width: 400px; margin: 20px auto;">`;
            
            html += `<div style="margin-bottom: 10px; font-weight: bold;">÷ (x - ${c})</div>`;
            
            html += `<div class="synthetic-table" style="display: grid; grid-template-columns: auto repeat(${coeffs.length + 1}, 1fr); gap: 2px;">`;
            
            html += `<div style="padding: 8px; background: #6c5ce7; color: white; border-radius: 4px 0 0 0;">${c}</div>`;
            coeffs.forEach((coef, i) => {
                html += `<div style="padding: 8px; background: ${i === 0 ? '#a29bfe' : '#dfe6e9'}; text-align: center;">${coef}</div>`;
            });
            
            html += `<div style="padding: 8px; background: transparent;"></div>`;
            results.forEach((val, i) => {
                const bg = i === results.length - 1 ? '#fd79a8' : '#55efc4';
                html += `<div style="padding: 8px; background: ${bg}; text-align: center; font-weight: bold;">${val}</div>`;
            });
            
            html += '</div>';
            html += '</div>';
            return html;
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = GridRenderer;
    }
    global.GridRenderer = GridRenderer;

})(typeof window !== 'undefined' ? window : this);
