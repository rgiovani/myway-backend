import Content from './Content.entity';
import File from '../../utils/shared/entities/File.entity';

/** * This creates an instance of a new file */
export function createFile(file) {
    const fileInstance = File.create({
        newName: file.filename,
        oldName: file.originalname,
        format: file.mimetype,
        link: file.filename,
        created_at: new Date(),
        updated_at: new Date()
    });
    return fileInstance;
}

/** * This creates an instance of new content for the course */
export function createContent(content: Content, fileCreated: File, idCourse: string): Content {
    const newContent = Content.create({
        title: content.title,
        contentType: content.contentType,
        course: {
            id: idCourse
        },
        file: fileCreated,
        description: content.description,
        created_at: new Date(),
        updated_at: new Date()
    });
    return newContent;
}
