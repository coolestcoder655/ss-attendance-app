import { db } from './firebase';
import { getDocs, collection } from 'firebase/firestore';
import * as XLSX from 'xlsx';

const downloadXLSX = async (collectionName: string): Promise<void> => {
    try {
        // Fetch documents from the specified Firestore collection
        const querySnapshot = await getDocs(collection(db, collectionName));
        
        // Prepare combined student data as in getData.py
        const combinedStudents: any[] = [];
        querySnapshot.forEach((doc) => {
            const record = doc.data();
            const students = record.submittedClasses?.students || [];
            const grade = record.submittedClasses?.grade || '';
            const period = record.period || '';
            let date = record.datetime;
            // Convert Firestore Timestamp to ISO string if needed
            if (date && typeof date.toDate === 'function') {
                date = date.toDate().toISOString();
            }
            students.forEach((student: any) => {
                combinedStudents.push({
                    name: student.name || '',
                    isAbsent: student.isAbsent !== undefined ? String(student.isAbsent).toUpperCase() : 'FALSE',
                    notes: student.notes || '',
                    grade: grade,
                    period: period,
                    date: date || '',
                });
            });
        });

        // Define the header order explicitly
        const header = ['name', 'isAbsent', 'notes', 'grade', 'period', 'date'];
        const worksheet = XLSX.utils.json_to_sheet(combinedStudents, { header });
        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
        worksheet['!cols'] = [
            { wch: 15 }, // name
            { wch: 8 },  // isAbsent
            { wch: 20 }, // notes
            { wch: 8 },  // grade
            { wch: 10 }, // period
            { wch: 30 }, // date
        ];

        // Create workbook and add the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, collectionName);

        // Generate buffer and download the file
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        
        // Create a link to download the file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${collectionName}.xlsx`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading XLSX:', error);
    }
};

export default downloadXLSX;