import React from 'react'
import { useState } from 'react';

function SumCalculator() {

    // Các hàm bổ trợ để xử lý số nguyên lớn dưới dạng chuỗi
    /**
   * Cộng 2 chuỗi số DƯƠNG
   */
  const AddPositiveBigInts = (num1, num2) => {
    let result = '';
    let carry = 0;
    let i = num1.length - 1;
    let j = num2.length - 1;

    while (i >= 0 || j >= 0 || carry > 0) {
      const digit1 = i >= 0 ? parseInt(num1[i], 10) : 0;
      const digit2 = j >= 0 ? parseInt(num2[j], 10) : 0;
      const currentSum = digit1 + digit2 + carry;
      const newDigit = currentSum % 10;
      result = newDigit + result;
      carry = Math.floor(currentSum / 10);
      i--;
      j--;
    }
    return result === '' ? '0' : result;
  };

  /**
   * So sánh 2 chuỗi số DƯƠNG (num1 >= num2)
   * Trả về true nếu num1 >= num2, ngược lại trả về false.
   */
  const IsBiggerOrEqual = (num1, num2) => {
    if (num1.length > num2.length) return true;
    if (num1.length < num2.length) return false;
    
    // Nếu độ dài bằng nhau, so sánh từng ký tự
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
   * Kết quả có thể là ÂM.
   */
  const SubtractPositiveBigInts = (num1, num2) => {
    // Hàm phụ bên trong: thực hiện phép trừ (lớn - bé)
    const subtract = (larger, smaller) => {
      let result = '';
      let borrow = 0;
      let i = larger.length - 1;
      let j = smaller.length - 1;

      while (i >= 0) {
        let digit1 = parseInt(larger[i], 10);
        let digit2 = j >= 0 ? parseInt(smaller[j], 10) : 0;

        digit1 = digit1 - borrow; // Áp dụng mượn (borrow)

        let currentDiff;
        if (digit1 >= digit2) {
          currentDiff = digit1 - digit2;
          borrow = 0; // Không cần mượn
        } else {
          currentDiff = (digit1 + 10) - digit2; // Mượn 10
          borrow = 1; // Ghi nhớ đã mượn
        }

        result = currentDiff.toString() + result;
        i--;
        j--;
      }
      
      // Xóa các số 0 ở đầu (ví dụ: "100" - "99" = "001" -> "1")
      let k = 0;
      while (result[k] === '0' && k < result.length - 1) {
        k++;
      }
      return result.substring(k);
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
   * HÀM 4: HÀM ĐIỀU PHỐI
   * Hàm này sẽ kiểm tra dấu và gọi hàm Cộng hoặc Trừ tương ứng.
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
      return SubtractPositiveBigInts(absNum2, absNum1);
    }
  };

    // Phần logic và state của component

  // Sử dụng useState để quản lý các giá trị đầu vào
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  
  // State để lưu trữ kết quả tính toán
  const [sum, setSum] = useState(null);
  
  // State để hiển thị thông báo lỗi
  const [error, setError] = useState('');

  // Hàm xử lý thay đổi cho Number 1
  const handleNum1Change = (e) => {
    if (error) setError(''); // Xóa lỗi khi người dùng bắt đầu nhập
    setNum1(e.target.value);
  };

  // Hàm xử lý thay đổi cho Number 2
  const handleNum2Change = (e) => {
    if (error) setError(''); // Xóa lỗi khi người dùng bắt đầu nhập
    setNum2(e.target.value);
  };
  /**
   * Hàm này xử lý việc tính toán khi nhấn nút.
   */
  const handleCalculate = () => {
    // Đặt lại tổng và lỗi trước mỗi lần tính toán
    setSum(null);
    setError('');

    // --- Bắt đầu logic validation chi tiết ---
    const n1 = num1.trim();
    const n2 = num2.trim();

    // 1. Kiểm tra cả hai ô rỗng
    if (n1 === '' && n2 === '') {
      setError('Vui lòng nhập 2 số hạng vào "Number 1" và "Number 2"');
      return;
    }

    // 2. Kiểm tra một trong hai ô rỗng
    if (n1 === '') {
      setError('Vui lòng nhập vào Number 1.');
      return;
    }
    if (n2 === '') {
      setError('Vui lòng nhập vào Number 2.');
      return;
    }

    // 3. Kiểm tra ký tự không hợp lệ (ngoại trừ số, '.', và ',')
    // Regex này tìm bất kỳ ký tự nào KHÔNG phải là 0-9, . hoặc ,
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

    // 3.5. Kiểm tra vị trí dấu - (âm)
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
    if (n1 === '-.' || n2 === '-.') {
        setError('Vui lòng nhập một số hợp lệ (ví dụ: -0.5).');
        return;
    }

    // 4. Kiểm tra dấu phẩy (,)
    if (n1.includes(',') || n2.includes(',')) {
        setError('Định dạng dấu thập phân là dấu ".", không phải là dấu ",".');
        return;
    }

    // 5. Kiểm tra nhiều hơn một dấu chấm (.)
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

    // --- Chuyển đổi và tính toán ---
    // Nếu tất cả kiểm tra đã qua, chúng ta biết chuỗi chỉ chứa số và tối đa 1 dấu chấm
    const parsedNum1 = Number(n1);
    const parsedNum2 = Number(n2);

    // Kiểm tra lần cuối cho các trường hợp không hợp lệ như "1." hoặc "."
    // isNaN(Number('.')) sẽ là true
    if (isNaN(parsedNum1) || isNaN(parsedNum2)) {
      setError('Vui lòng nhập số hợp lệ (ví dụ: 123 hoặc 45.6).');
      return;
    }

    // 7. LOGIC PHÂN NHÁNH: Số nguyên lớn hay Số thập phân
    // Kiểm tra xem có phải là số thập phân không
    if (n1.includes('.') || n2.includes('.')) {
      // **Trường hợp 1: Có số thập phân**
      // Sử dụng phép cộng Number() bình thường
      setSum(parsedNum1 + parsedNum2);
    } else {
      // **Trường hợp 2: Cả hai đều là số nguyên**
      // Sử dụng hàm SumBigInt để xử lý số nguyên lớn
      const bigIntSum = SumBigInt(n1, n2);
      setSum(bigIntSum); // Kết quả từ SumBigInt đã là string (hoặc số nếu muốn)
    }
    // --- Kết thúc logic validation ---
  };
  // Phần JSX để hiển thị giao diện
  return (
    <div className="w-full md:w-2/3 lg:w-1/2 mx-auto p-6 bg-gradient-to-br from-indigo-50 
    to-purple-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-xl font-sans">
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
            type="text"
            id="num1"
            value={num1}
            onChange={handleNum1Change}
            placeholder="Nhập số thứ nhất"
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
            placeholder="Nhập số thứ hai"
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
          disabled={!!error}
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
        {/* Hiển thị lỗi nếu có */}
        {error && (
          <p className="text-lg font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {/* Hiển thị tổng nếu hợp lệ và đã được tính */}
        {sum !== null && (
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            Result: <span className="text-indigo-600 dark:text-indigo-400">{sum}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default SumCalculator;