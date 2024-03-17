import fs from 'fs';

/**
 * 將指定內容寫入指定檔案。
 * @param {string} fileName - 檔案名稱，包括路徑。
 * @param {string} content - 要寫入檔案的內容。
 * @param {function} callback - 寫入完成後的回調函數，接受一個錯誤參數。
 */
export function writeFile(fileName: string, content: string, callback: (err?: NodeJS.ErrnoException | null) => void): void {
  fs.writeFile(fileName, content, (err) => {
    if (err) {
      console.error('寫入文件時發生錯誤:', err);
    } else {
      console.log('成功寫入文件:', fileName);
    }
    // 調用回調函數，將錯誤參數傳遞給回調函數
    callback(err);
  });
}