export const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        let reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result as string);
    });
};
