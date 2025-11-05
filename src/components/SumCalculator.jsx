import React from 'react'
// Import hook useState để quản lý trạng thái của component
import { useState } from 'react';

/**
 * Component SumCalculator:
 * - Cho phép người dùng nhập 2 số (số nguyên hoặc số thập phân).
 * - Hỗ trợ tính toán với số nguyên RẤT LỚN (vượt quá giới hạn của Number.MAX_SAFE_INTEGER)
 * bằng cách xử lý chúng dưới dạng chuỗi.
 * - Nếu là số thập phân, nó sẽ sử dụng phép toán Number() tiêu chuẩn.
 * - Bao gồm validation (kiểm tra đầu vào) chi tiết.
 */
function SumCalculator() {

    // ========================================================================
    // CÁC HÀM BỔ TRỢ XỬ LÝ SỐ NGUYÊN LỚN (DẠNG CHUỖI)
    // ========================================================================

    /**
     * Cộng 2 chuỗi số DƯƠNG (ví dụ: "123" + "456")
     * @param {string} num1 - Chuỗi số dương thứ nhất
     * @param {string} num2 - Chuỗi số dương thứ hai
     * @returns {string} - Tổng của hai chuỗi số
     */
    const AddPositiveBigInts = (num1, num2) => {
        let result = '';
        let carry = 0; // Biến nhớ
        let i = num1.length - 1; // Con trỏ cho num1 (đi từ phải sang trái)
        let j = num2.length - 1; // Con trỏ cho num2 (đi từ phải sang trái)

        // Lặp cho đến khi cả hai chuỗi kết thúc và không còn biến nhớ
        while (i >= 0 || j >= 0 || carry > 0) {
            const digit1 = i >= 0 ? parseInt(num1[i], 10) : 0; // Lấy chữ số của num1 (hoặc 0 nếu hết)
            const digit2 = j >= 0 ? parseInt(num2[j], 10) : 0; // Lấy chữ số của num2 (hoặc 0 nếu hết)
            
            const currentSum = digit1 + digit2 + carry; // Tính tổng
            const newDigit = currentSum % 10; // Chữ số mới
            result = newDigit + result; // Thêm vào *đầu* kết quả
            carry = Math.floor(currentSum / 10); // Cập nhật biến nhớ
            
            // Di chuyển con trỏ
            i--;
            j--;
        }
        return result === '' ? '0' : result; // Trả về '0' nếu kết quả rỗng
    };

    /**
     * So sánh 2 chuỗi số DƯƠNG (num1 >= num2)
     * @param {string} num1 - Chuỗi số dương thứ nhất
     * @param {string} num2 - Chuỗi số dương thứ hai
     * @returns {boolean} - True nếu num1 >= num2, ngược lại là false.
     */
    const IsBiggerOrEqual = (num1, num2) => {
        // So sánh độ dài trước
        if (num1.length > num2.length) return true;
        if (num1.length < num2.length) return false;
        
        // Nếu độ dài bằng nhau, so sánh từng ký tự từ trái sang phải
        for (let i = 0; i < num1.length; i++) {
            if (num1[i] > num2[i]) return true;
            if (num1[i] < num2[i]) return false;
        }
        // Nếu chúng bằng nhau
        return true;
    };

    /**
     * Trừ 2 chuỗi số DƯƠNG (num1 - num2)
     * Hàm này giả định num1 và num2 là DƯƠNG.
     * Kết quả có thể là ÂM (ví dụ: "50" - "100" = "-50").
     * @param {string} num1 - Chuỗi số dương thứ nhất (số bị trừ)
     * @param {string} num2 - Chuỗi số dương thứ hai (số trừ)
     * @returns {string} - Hiệu của hai chuỗi số (có thể có dấu "-")
     */
    const SubtractPositiveBigInts = (num1, num2) => {
        
        // Hàm phụ bên trong: thực hiện phép trừ (lớn - bé)
        // Hàm này luôn trả về số DƯƠNG.
        const subtract = (larger, smaller) => {
            let result = '';
            let borrow = 0; // Biến mượn
            let i = larger.length - 1;
            let j = smaller.length - 1;

            while (i >= 0) {
                let digit1 = parseInt(larger[i], 10);
                let digit2 = j >= 0 ? parseInt(smaller[j], 10) : 0;

                digit1 = digit1 - borrow; // Áp dụng mượn (borrow) từ lần lặp trước

                let currentDiff;
                if (digit1 >= digit2) {
                    currentDiff = digit1 - digit2;
                    borrow = 0; // Không cần mượn
                } else {
                    currentDiff = (digit1 + 10) - digit2; // Mượn 10
                    borrow = 1; // Ghi nhớ đã mượn cho lần lặp tiếp theo
                }

                result = currentDiff.toString() + result;
                i--;
                j--;
            }
            
            // Xóa các số 0 ở đầu (ví dụ: "100" - "99" = "001" -> "1")
            let k = 0;
            // Lặp để tìm vị trí của chữ số đầu tiên khác 0
            while (result[k] === '0' && k < result.length - 1) {
                k++;
            }
            return result.substring(k); // Cắt chuỗi từ vị trí k
        };

        // Logic chính của SubtractPositiveBigInts
        if (IsBiggerOrEqual(num1, num2)) {
            // Trường hợp 1: 100 - 50 = 50 (Kết quả dương)
            return subtract(num1, num2);
        } else {
            // Trường hợp 2: 50 - 100 = -(100 - 50) = -50 (Kết quả âm)
            const diff = subtract(num2, num1);
            // Tránh trả về "-0"
            return diff === '0' ? '0' : '-' + diff;
        }
    };

    /**
     * HÀM ĐIỀU PHỐI (Hàm cộng tổng quát)
     * Hàm này sẽ kiểm tra dấu của 2 số (đã là chuỗi) và gọi hàm Cộng (Add) hoặc Trừ (Subtract) tương ứng.
     * @param {string} num1 - Số thứ nhất (có thể có dấu "-")
     * @param {string} num2 - Số thứ hai (có thể có dấu "-")
     * @returns {string} - Kết quả tổng
     */
    const SumBigInt = (num1, num2) => {
        // Kiểm tra dấu
        const isNum1Neg = num1.startsWith('-');
        const isNum2Neg = num2.startsWith('-');

        // Lấy giá trị tuyệt đối (bỏ dấu -)
        const absNum1 = isNum1Neg ? num1.substring(1) : num1;
        const absNum2 = isNum2Neg ? num2.substring(1) : num2;

        // --- Phân 4 trường hợp ---

        // Case 1: A + B (Cả hai đều dương)
        // Ví dụ: 50 + 100
        if (!isNum1Neg && !isNum2Neg) {
            return AddPositiveBigInts(absNum1, absNum2);
        }

        // Case 2: (-A) + (-B) => -(A + B)
        // Ví dụ: -50 + (-100) => -(50 + 100)
        if (isNum1Neg && isNum2Neg) {
            const sum = AddPositiveBigInts(absNum1, absNum2);
            // Tránh trả về "-0"
            return sum === '0' ? '0' : '-' + sum;
        }

        // Case 3: A + (-B) => A - B
        // Ví dụ: 100 + (-50) => 100 - 50
        if (!isNum1Neg && isNum2Neg) {
            return SubtractPositiveBigInts(absNum1, absNum2);
        }

        // Case 4: (-A) + B => B - A
        // Ví dụ: -50 + 100 => 100 - 50
        if (isNum1Neg && !isNum2Neg) {
            // Đây chính là phép toán (B - A)
            return SubtractPositiveBigInts(absNum2, absNum1);
        }
    };

    // ========================================================================
    // PHẦN LOGIC VÀ STATE CỦA COMPONENT REACT
    // ========================================================================

    // Sử dụng useState để quản lý các giá trị đầu vào (luôn là chuỗi)
    const [num1, setNum1] = useState('');
    const [num2, setNum2] = useState('');
    
    // State để lưu trữ kết quả tính toán (có thể là string hoặc number)
    const [sum, setSum] = useState(null); // null = chưa tính toán
    
    // State để hiển thị thông báo lỗi (chuỗi rỗng = không có lỗi)
    const [error, setError] = useState('');


    // Hàm xử lý thay đổi cho Input 1
    const handleNum1Change = (e) => {
        if (error) setError(''); // Xóa lỗi cũ khi người dùng bắt đầu nhập lại
        setNum1(e.target.value); // Cập nhật state
    };

    // Hàm xử lý thay đổi cho Input 2
    const handleNum2Change = (e) => {
        if (error) setError(''); // Xóa lỗi cũ khi người dùng bắt đầu nhập lại
        setNum2(e.target.value); // Cập nhật state
    };

    /**
     * Hàm này xử lý việc tính toán khi nhấn nút "Calculate Sum".
     * Bao gồm:
     * 1. Đặt lại trạng thái
     * 2. Validation (Kiểm tra tính hợp lệ) chi tiết
     * 3. Quyết định dùng logic BigInt (số nguyên lớn) hay logic Number (số thập phân)
     * 4. Cập nhật state (sum hoặc error)
     */
    const handleCalculate = () => {
        // 1. Đặt lại tổng và lỗi trước mỗi lần tính toán
        setSum(null);
        setError('');

        // --- 2. Bắt đầu logic validation chi tiết ---
        
        // Lấy giá trị và xóa khoảng trắng thừa
        const n1 = num1.trim();
        const n2 = num2.trim();

        // Kiểm tra cả hai ô rỗng
        if (n1 === '' && n2 === '') {
            setError('Vui lòng nhập 2 số hạng vào "Number 1" và "Number 2"');
            return; // Dừng hàm
        }

        // Kiểm tra một trong hai ô rỗng
        if (n1 === '') {
            setError('Vui lòng nhập vào Number 1.');
            return;
        }
        if (n2 === '') {
            setError('Vui lòng nhập vào Number 2.');
            return;
        }

        // Kiểm tra ký tự không hợp lệ (ngoại trừ số 0-9, dấu chấm '.', dấu phẩy ',', và dấu trừ '-')
        // Regex này tìm bất kỳ ký tự nào KHÔNG phải là 0-9, . , hoặc -
        const invalidCharRegex = /[^0-9.,-]/;
        if (invalidCharRegex.test(n1) && invalidCharRegex.test(n2)) {
            setError('Vui lòng chỉ nhập ký tự là số hoặc là dấu thập phân vào cả hai ô.');
            return;
        }
        if (invalidCharRegex.test(n1)) {
            setError('Vui lòng chỉ nhập ký tự là số hoặc là dấu thập phân vào Number 1.');
            return;
        }
        if (invalidCharRegex.test(n2)) {
            setError('Vui lòng chỉ nhập ký tự là số hoặc là dấu thập phân vào Number 2.');
            return;
        }

        // Kiểm tra vị trí dấu - (âm)
        // Dấu âm chỉ được ở đầu, và không được có nhiều hơn 1
        if ((n1.includes('-') && !n1.startsWith('-')) || (n1.split('-').length - 1 > 1)) {
            setError('Dấu âm (-) ở "Number 1" chỉ được phép ở đầu.');
            return;
        }
        if ((n2.includes('-') && !n2.startsWith('-')) || (n2.split('-').length - 1 > 1)) {
            setError('Dấu âm (-) ở "Number 2" chỉ được phép ở đầu.');
            return;
        }
        
        // Kiểm tra trường hợp đặc biệt: chỉ nhập "-" hoặc "-."
        if (n1 === '-' || n2 === '-') {
            setError('Vui lòng nhập một số hợp lệ (ví dụ: -123).');
            return;
        }
        // (Lưu ý: ".-" đã bị regex ở trên chặn)
        if (n1 === '-.' || n2 === '-.' || n1 === '.' || n2 === '.') {
            setError('Vui lòng nhập một số hợp lệ (ví dụ: -0.5 hoặc 0.5).');
            return;
        }

        // Kiểm tra dấu phẩy (,) -> Yêu cầu dùng dấu chấm
        if (n1.includes(',') || n2.includes(',')) {
            setError('Định dạng dấu thập phân là dấu ".", không phải là dấu ",".');
            return;
        }

        // Kiểm tra nhiều hơn một dấu chấm (.)
        if ((n1.split('.').length - 1) > 1 && (n2.split('.').length - 1) > 1) {
            setError('Khi nhập số thập phân ở cả hai ô, chỉ nhập một dấu thập phân.');
            return;
        }
        if ((n1.split('.').length - 1) > 1) {
            setError('Khi nhập số thập phân ở Number 1, chỉ nhập một dấu thập phân.');
            return;
        }
        if ((n2.split('.').length - 1) > 1) {
            setError('Khi nhập số thập phân ở Number 2, chỉ nhập một dấu thập phân.');
            return;
        }

        // --- 3. Chuyển đổi và tính toán ---
        
        // Kiểm tra xem có phải là số thập phân không (dựa vào dấu '.')
        const isDecimal = n1.includes('.') || n2.includes('.');

        if (isDecimal) {
            // **Trường hợp 1: Có số thập phân**
            // Chuyển đổi sang Number.
            const parsedNum1 = Number(n1);
            const parsedNum2 = Number(n2);
            
            // isNaN(Number('1.')) là false, nhưng isNaN(Number('.')) là true
            // Kiểm tra lần cuối cho các trường hợp không hợp lệ như "1.2.3" (đã bị chặn ở trên) hoặc "."
            if (isNaN(parsedNum1) || isNaN(parsedNum2)) {
                setError('Vui lòng nhập số thập phân hợp lệ (ví dụ: 123 hoặc 45.6).');
                return;
            }
            
            // Sử dụng phép cộng Number() bình thường
            setSum(parsedNum1 + parsedNum2);

        } else {
            // **Trường hợp 2: Cả hai đều là số nguyên**
            // (Chúng ta đã chặn dấu chấm '.' ở nhánh trên)
            
            // Sử dụng hàm SumBigInt để xử lý số nguyên lớn (đầu vào là chuỗi n1, n2)
            const bigIntSum = SumBigInt(n1, n2);
            
            // 4. Cập nhật state
            setSum(bigIntSum); // Kết quả từ SumBigInt đã là string
        }
        // --- Kết thúc logic validation ---
    };
    
    // ========================================================================
    // PHẦN JSX (GIAO DIỆN)
    // ========================================================================
    return (
        // Container chính
        <div className="w-full md:w-2/3 lg:w-1/2 mx-auto p-6 bg-gradient-to-br from-indigo-50 
        to-purple-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-xl font-sans">
        
            {/* Tiêu đề */}
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                Sum Calculator
            </h1>
            
            <div className="space-y-4">
                {/* Input cho Số 1 */}
                <div>
                    <label htmlFor="num1" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Number 1
                    </label>
                    <input
                        type="text" // Dùng type="text" để có thể nhập số lớn và dấu "-"
                        id="num1"
                        value={num1}
                        onChange={handleNum1Change}
                        placeholder="Nhập số thứ nhất (ví dụ: 123 hoặc -123)"
                        maxLength={21}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 
                        dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 
                        dark:focus:border-indigo-500"
                    />
                </div>

                {/* Input cho Số 2 */}
                <div>
                    <label htmlFor="num2" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Number 2
                    </label>
                    <input
                        type="text"
                        id="num2"
                        value={num2}
                        onChange={handleNum2Change}
                        placeholder="Nhập số thứ hai (ví dụ: 456 hoặc 45.6)"
                        maxLength={21}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 
                        dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 
                        dark:focus:border-indigo-500"
                    />
                </div>

                {/* Nút tính toán */}
                <button
                    onClick={handleCalculate}
                    disabled={!!error} // Vô hiệu hóa nút nếu có lỗi (chuyển error thành boolean)
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md 
                    shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                    focus:ring-offset-2 transition duration-200 dark:bg-indigo-500 dark:hover:bg-indigo-600 
                    dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Calculate Sum
                </button>
            </div>

            {/* Khu vực hiển thị kết quả */}
            <div className="mt-6 text-center">
                
                {/* Hiển thị lỗi (nếu state 'error' không rỗng) */}
                {error && (
                <p className="text-lg font-medium text-red-600 dark:text-red-400">
                    {error}
                </p>
                )}

                {/* Hiển thị tổng (nếu state 'sum' không phải là null VÀ không có lỗi) */}
                {/* Logic !error là không cần thiết vì nút bị vô hiệu hóa khi có lỗi, 
                    nhưng 'sum !== null' là quan trọng để không hiển thị 'Result: 0' lúc ban đầu */}
                {sum !== null && !error && (
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    Result: <span className="text-indigo-600 dark:text-indigo-400">{sum}</span>
                </p>
                )}
            </div>
        </div>
    );
}

// Xuất component để các file khác có thể import
export default SumCalculator;