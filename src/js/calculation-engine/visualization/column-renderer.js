(function(global) {
    'use strict';

    const ColumnRenderer = {
        renderAddition(num1, num2, steps) {
            const maxLen = Math.max(num1.toString().length, num2.toString().length);
            const n1Str = num1.toString().padStart(maxLen, ' ');
            const n2Str = num2.toString().padStart(maxLen, ' ');
            
            let html = `<div class="addition-column" style="font-family: monospace; font-size: 1.2rem; background: #f5f6fa; padding: 20px; border-radius: 10px; max-width: 200px; margin: 20px auto;">`;
            
            html += `<div class="addend-1" style="text-align: right; padding: 4px 8px; border-bottom: 2px solid #6c5ce7;">${n1Str}</div>`;
            html += `<div class="addend-2" style="text-align: right; padding: 4px 8px; border-bottom: 2px solid #00b894;">+ ${n2Str}</div>`;
            html += `<div class="line" style="height: 2px; background: #2d3436; margin: 4px 0;"></div>`;
            
            html += `<div class="sum" style="text-align: right; padding: 8px; font-weight: bold; font-size: 1.5rem; color: #6c5ce7;">
                ${num1 + num2}
            </div>`;
            
            html += '</div>';
            return html;
        },

        renderSubtraction(num1, num2) {
            const maxLen = Math.max(num1.toString().length, num2.toString().length);
            const n1Str = num1.toString().padStart(maxLen, ' ');
            const n2Str = num2.toString().padStart(maxLen, ' ');
            
            let html = `<div class="subtraction-column" style="font-family: monospace; font-size: 1.2rem; background: #f5f6fa; padding: 20px; border-radius: 10px; max-width: 200px; margin: 20px auto;">`;
            
            html += `<div class="minuend" style="text-align: right; padding: 4px 8px; border-bottom: 2px solid #6c5ce7;">${n1Str}</div>`;
            html += `<div class="subtrahend" style="text-align: right; padding: 4px 8px; border-bottom: 2px solid #e84393;">- ${n2Str}</div>`;
            html += `<div class="line" style="height: 2px; background: #2d3436; margin: 4px 0;"></div>`;
            
            html += `<div class="difference" style="text-align: right; padding: 8px; font-weight: bold; font-size: 1.5rem; color: #e84393;">
                ${num1 - num2}
            </div>`;
            
            html += '</div>';
            return html;
        },

        renderMultiplication(num1, num2, partialProducts = []) {
            const n1Str = num1.toString();
            const n2Str = num2.toString();
            
            let html = `<div class="multiplication-column" style="font-family: monospace; font-size: 1.1rem; background: #f5f6fa; padding: 20px; border-radius: 10px; max-width: 250px; margin: 20px auto;">`;
            
            html += `<div class="multiplicand" style="text-align: right; padding: 4px 8px;">× ${n1Str}</div>`;
            html += `<div class="multiplier" style="text-align: right; padding: 4px 8px; border-bottom: 2px solid #6c5ce7;">× ${n2Str}</div>`;
            
            if (partialProducts.length > 0) {
                html += `<div class="partial-products" style="margin-top: 8px;">`;
                partialProducts.forEach((pp, i) => {
                    const shift = pp.shift || 0;
                    const shiftSpaces = '  '.repeat(shift);
                    html += `<div class="partial" style="text-align: right; padding: 4px 8px; color: #00b894;">
                        ${shiftSpaces}${pp.value}
                    </div>`;
                });
                html += `</div>`;
            }
            
            html += `<div class="line" style="height: 2px; background: #2d3436; margin: 4px 0;"></div>`;
            
            html += `<div class="product" style="text-align: right; padding: 8px; font-weight: bold; font-size: 1.4rem; color: #6c5ce7;">
                ${num1 * num2}
            </div>`;
            
            html += '</div>';
            return html;
        },

        renderDivision(dividend, divisor, quotient, remainder) {
            let html = `<div class="division-column" style="font-family: monospace; font-size: 1.1rem; background: #f5f6fa; padding: 20px; border-radius: 10px; max-width: 300px; margin: 20px auto;">`;
            
            html += `<div style="display: flex; align-items: center; justify-content: center; gap: 10px;">`;
            html += `<div class="divisor" style="padding: 4px 8px; background: #e84393; color: white; border-radius: 4px;">${divisor}</div>`;
            html += `<div class="dividend" style="padding: 4px 8px; border-bottom: 3px solid #6c5ce7;">${dividend}</div>`;
            html += `</div>`;
            
            html += `<div class="quotient" style="text-align: center; padding: 16px; font-weight: bold; font-size: 1.5rem; color: #6c5ce7;">
                ${quotient}
            </div>`;
            
            if (remainder !== undefined && remainder !== 0) {
                html += `<div class="remainder" style="text-align: center; font-size: 0.9rem; color: #636e72;">
                    Remainder: ${remainder}
                </div>`;
            }
            
            html += '</div>';
            return html;
        },

        renderColumnStep(stepData) {
            const { num1, num2, operation, carry, borrow, result } = stepData;
            
            switch (operation) {
                case 'addition':
                    return this.renderAddition(num1, num2);
                case 'subtraction':
                    return this.renderSubtraction(num1, num2);
                case 'multiplication':
                    return this.renderMultiplication(num1, num2);
                case 'division':
                    return this.renderDivision(num1, num2, result?.quotient, result?.remainder);
                default:
                    return '';
            }
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ColumnRenderer;
    }
    global.ColumnRenderer = ColumnRenderer;

})(typeof window !== 'undefined' ? window : this);
