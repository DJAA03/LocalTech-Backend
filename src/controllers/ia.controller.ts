import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Categoria } from '../models/categoria.model';
import { Producto } from '../models/producto.model';
import { ProductVector } from '../models/productVector.model';
import cosineSimilarity from 'cosine-similarity';

if (!process.env.GOOGLE_API_KEY) {
    throw new Error("La variable de entorno GOOGLE_API_KEY no está definida.");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const generationModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

export const generateDescription = async (req: Request, res: Response) => {
    try {
        const { nombre, categoria } = req.body;
        if (!nombre || !categoria) {
            return res.status(400).json({ message: 'El nombre y la categoría del producto son requeridos.' });
        }

        const prompt = `Eres un experto en marketing de tecnología. Escribe una descripción de producto de 2 párrafos, persuasiva y atractiva para un producto llamado "${nombre}" que pertenece a la categoría de "${categoria}". Destaca sus características clave de forma vendedora.`;
        
        const result = await generationModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ description: text });
    } catch (error) {
        console.error("Error detallado al generar descripción con IA:", error);
        res.status(500).json({ message: 'Error en el servidor al generar la descripción.' });
    }
};

export const chatWithBot = async (req: Request, res: Response) => {
    try {
        const { history, message } = req.body;
        if (!history || !message) {
            return res.status(400).json({ message: 'El historial y el mensaje son requeridos.' });
        }

        const categorias = await Categoria.find().select('nombre');
        const nombresCategorias = categorias.map(c => c.nombre).join(', ') || 'ninguna por el momento';

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: `Eres "TecnoBot", un asistente virtual amigable y servicial de la tienda de tecnología LocalTech.
            - Tu objetivo es ayudar a los clientes con sus preguntas sobre productos, pedidos y soporte técnico.
            - Las únicas categorías de productos que manejamos son: ${nombresCategorias}.
            - NUNCA te inventes productos o categorías que no estén en esa lista. Si te preguntan por algo que no está en la lista, debes decir amablemente que no manejas ese tipo de producto por el momento.
            - Si te preguntan cómo contactar a un técnico, diles que pueden enviar un correo a soporte@localtech.com o llamar al 2244-5566.
            - Sé siempre cortés y profesional y mantén tus respuestas concisas.`,
        });

        const chat = model.startChat({
            history: history,
            generationConfig: { maxOutputTokens: 200 },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error("Error en el chat con IA:", error);
        res.status(500).json({ message: 'Error en el servidor al procesar el chat.' });
    }
};

export const generateProductEmbedding = async (producto: any) => {
    const categoriaNombre = (producto.categoria && typeof producto.categoria === 'object') ? producto.categoria.nombre : 'General';
    
    const textoParaVectorizar = `Nombre: ${producto.nombre}. Categoría: ${categoriaNombre}. Descripción: ${producto.descripcion}`;
    
    const result = await embeddingModel.embedContent(textoParaVectorizar);
    const embedding = result.embedding.values;

    await ProductVector.findOneAndUpdate(
        { producto: producto._id },
        { 
            producto: producto._id,
            vector: embedding,
            contenido: textoParaVectorizar
        },
        { upsert: true, new: true }
    );
};

export const generateAllEmbeddings = async (req: Request, res: Response) => {
    try {
        const productos = await Producto.find().populate('categoria', 'nombre');
        for (const producto of productos) {
            await generateProductEmbedding(producto);
        }
        res.status(200).json({ message: 'Todos los vectores de productos han sido generados exitosamente.' });
    } catch (error) {
        console.error("Error al generar todos los embeddings:", error);
        res.status(500).json({ message: 'Error al generar los vectores.' });
    }
};

export const semanticSearch = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ message: "La consulta de búsqueda es requerida." });
        }

        const result = await embeddingModel.embedContent(query as string);
        const queryVector = result.embedding.values;

        const allProductVectors = await ProductVector.find();

        const similarities = allProductVectors.map(pv => ({
            productoId: pv.producto,
            score: cosineSimilarity(queryVector, pv.vector)
        }));

        const sortedResults = similarities
            .filter(sim => sim.score > 0.4) 
            .sort((a, b) => b.score - a.score)
            .slice(0, 12);

        const productIds = sortedResults.map(sim => sim.productoId);
        
        const productosEncontrados = await Producto.find({ '_id': { $in: productIds } }).populate('categoria', 'nombre');
        
        const orderedProducts = productIds.map(id => productosEncontrados.find(p => p._id.equals(id))).filter(p => p);

        res.json(orderedProducts);
    } catch (error) {
        console.error("Error en la búsqueda semántica:", error);
        res.status(500).json({ message: "Error al realizar la búsqueda." });
    }
};