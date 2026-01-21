(function(global) {
    'use strict';

    const BinaryRenderer = {
        toBinary(num, bitWidth = 8) {
            const isNegative = num < 0;
            const absNum = Math.abs(num);
            let binary = '';
            let temp = absNum;
            
            for (let i = 0; i < bitWidth; i++) {
                binary = (temp % 2) + binary;
                temp = Math.floor(temp / 2);
            }
            
            return { binary, isNegative };
        },

        renderBinary(num, bitWidth = 8, showValue = true) {
            const { binary, isNegative } = this.toBinary(num, bitWidth);
            
            let html = `<div class="binary-display" style="font-family: 'Courier New', monospace; font-size: 1.2rem; background: #2d3436; color: #00cec9; padding: 16px; border-radius: 8px; max-width: ${bitWidth * 20 + 40}px; margin: 10px auto;">`;
            
            if (showValue) {
                html += `<div style="font-size: 0.9rem; color: #dfe6e9; margin-bottom: 8px;">${isNegative ? '-' : ''}${num}</div>`;
            }
            
            const groups = binary.match(/.{1,4}/g) || [];
            html += `<div class="binary-value" style="letter-spacing: 2px;">`;
            
            groups.forEach((group, i) => {
                if (i > 0) {
                    html += `<span style="margin-left: 8px;"></span>`;
                }
                html += group.split('').map((bit, j) => {
                    const isHighlight = (binary.length - 1 - (i * 4 + j)) % 4 === 0;
                    return `<span style="color: ${isHighlight ? '#fd79a8' : '#00cec9'};">${bit}</span>`;
                }).join('');
            });
            
            html += `</div>`;
            
            if (isNegative) {
                html += `<div style="margin-top: 8px; font-size: 0.8rem; color: #fdcb6e;">(Two's complement)</div>`;
            }
            
            html += '</div>';
            return html;
        },

        renderBinaryAddition(num1, num2, bitWidth = 8) {
            const { binary: b1 } = this.toBinary(num1, bitWidth);
            const { binary: b2 } = this.toBinary(num2, bitWidth);
            const result = num1 + num2;
            
            let html = `<div class="binary-addition" style="font-family: 'Courier New', monospace; font-size: 1rem; background: #2d3436; padding: 20px; border-radius: 10px; margin: 20px auto; max-width: ${bitWidth * 25 + 60}px;">`;
            
            html += `<div style="color: #dfe6e9; margin-bottom: 8px;">Addition with Carry</div>`;
            
            html += `<div style="display: flex; gap: 20px; justify-content: center; margin: 12px 0;">`;
            html += `<div style="color: #74b9ff;">${b1}</div>`;
            html += `<div style="color: #55efc4;">+ ${b2}</div>`;
            html += `</div>`;
            
            html += `<div style="height: 2px; background: #636e72; margin: 12px 0;"></div>`;
            
            html += `<div style="color: #fd79a8; font-size: 1.2rem; text-align: center;">
                ${this.toBinary(result, bitWidth).binary}
            </div>`;
            
            html += `<div style="color: #fdcb6e; font-size: 0.9rem; margin-top: 12px; text-align: center;">
                = ${result}
            </div>`;
            
            html += '</div>';
            return html;
        },

        renderTwoComplementSteps(num1, num2, bitWidth = 8) {
            const { binary: b1 } = this.toBinary(num1, bitWidth);
            const { binary: b2 } = this.toBinary(num2, bitWidth);
            
            let html = `<div class="twos-complement" style="font-family: 'Courier New', monospace; font-size: 0.9rem; background: #2d3436; padding: 20px; border-radius: 10px; margin: 20px auto; max-width: ${bitWidth * 25 + 80}px;">`;
            
            html += `<div style="color: #dfe6e9; margin-bottom: 16px;">Two's Complement Subtraction</div>`;
            
            html += `<div style="margin: 12px 0;">`;
            html += `<div style="color: #74b9ff; margin-bottom: 4px;">A: ${b1} (${num1})</div>`;
            html += `<div style="color: #55efc4; margin-bottom: 4px;">B: ${b2} (${num2})</div>`;
            html += `</div>`;
            
            const flippedB2 = b2.split('').map(b => b === '0' ? '1' : '0').join('');
            html += `<div style="margin: 12px 0;">`;
            html += `<div style="color: #fdcb6e;">Flip bits: ${flippedB2}</div>`;
            
            let twosComp = '';
            let carry = 1;
            for (let i = flippedB2.length - 1; i >= 0; i--) {
                const sum = parseInt(flippedB2[i]) + carry;
                twosComp = (sum % 2) + twosComp;
                carry = Math.floor(sum / 2);
            }
            html += `<div style="color: #fd79a8;">+ 1: ${twosComp} (-${num2})</div>`;
            html += `</div>`;
            
            html += `<div style="height: 2px; background: #636e72; margin: 12px 0;"></div>`;
            
            const result = num1 - num2;
            html += `<div style="color: #00cec9; font-size: 1.1rem; text-align: center;">
                ${b1} + ${twosComp} = ${this.toBinary(result, bitWidth).binary}
            </div>`;
            
            html += `<div style="color: #dfe6e9; font-size: 0.9rem; margin-top: 12px; text-align: center;">
                = ${result}
            </div>`;
            
            html += '</div>';
            return html;
        },

        renderBitComparison(binary1, binary2) {
            const len = Math.max(binary1.length, binary2.length);
            binary1 = binary1.padStart(len, '0');
            binary2 = binary2.padStart(len, '0');
            
            let html = `<div class="bit-comparison" style="font-family: 'Courier New', monospace; font-size: 0.9rem; display: flex; flex-direction: column; gap: 4px; margin: 10px 0;">`;
            
            html += `<div style="display: flex; gap: 2px;">`;
            for (let i = 0; i < len; i++) {
                const isDifferent = binary1[i] !== binary2[i];
                html += `<span style="color: ${isDifferent ? '#fd79a8' : '#74b9ff'}; padding: 2px 4px;">${binary1[i]}</span>`;
            }
            html += `</div>`;
            
            html += `<div style="display: flex; gap: 2px;">`;
            for (let i = 0; i < len; i++) {
                const isDifferent = binary1[i] !== binary2[i];
                html += `<span style="color: ${isDifferent ? '#fd79a8' : '#55efc4'}; padding: 2px 4px;">${binary2[i]}</span>`;
            }
            html += `</div>`;
            
            html += '</div>';
            return html;
        },

        renderCarryLookahead(generates, propagates, carries) {
            let html = `<div class="carry-lookahead" style="font-family: 'Courier New', monospace; font-size: 0.9rem; background: #2d3436; padding: 16px; border-radius: 8px; margin: 10px auto;">`;
            
            html += `<div style="color: #dfe6e9; margin-bottom: 12px;">Carry Lookahead Logic</div>`;
            
            html += `<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px;">`;
            html += `<div style="color: #74b9ff; text-align: center;">G</div>`;
            html += `<div style="color: #55efc4; text-align: center;">P</div>`;
            html += `<div style="color: #fdcb6e; text-align: center;">C_in</div>`;
            html += `<div style="color: #fd79a8; text-align: center;">C_out</div>`;
            
            for (let i = 0; i < generates.length; i++) {
                html += `<div style="text-align: center; color: #74b9ff;">${generates[i]}</div>`;
                html += `<div style="text-align: center; color: #55efc4;">${propagates[i]}</div>`;
                html += `<div style="text-align: center; color: #fdcb6e;">${carries[i] || 0}</div>`;
                html += `<div style="text-align: center; color: #fd79a8;">${carries[i + 1] || 0}</div>`;
            }
            
            html += `</div>`;
            html += `<div style="color: #a29bfe; font-size: 0.8rem; text-align: center;">G=Generate, P=Propagate, C=Carry</div>`;
            html += '</div>';
            return html;
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = BinaryRenderer;
    }
    global.BinaryRenderer = BinaryRenderer;

})(typeof window !== 'undefined' ? window : this);
