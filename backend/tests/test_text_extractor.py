import pytest
from pathlib import Path
from unittest.mock import patch, MagicMock
from app.services.text_extractor import TextExtractor

@pytest.mark.asyncio
async def test_extract_text_unsupported():
    with pytest.raises(ValueError, match="Unsupported file format"):
        await TextExtractor.extract_text(Path("test.txt"))

@pytest.mark.asyncio
@patch("app.services.text_extractor.pdfplumber.open")
async def test_extract_from_pdf(mock_pdf_open):
    # Setup mock
    mock_pdf = MagicMock()
    mock_page = MagicMock()
    mock_page.extract_text.return_value = "Sample PDF Text"
    mock_pdf.pages = [mock_page]
    mock_pdf.__enter__.return_value = mock_pdf
    mock_pdf_open.return_value = mock_pdf

    result = await TextExtractor.extract_from_pdf(Path("test.pdf"))
    assert result == "Sample PDF Text"

@pytest.mark.asyncio
@patch("app.services.text_extractor.Document")
async def test_extract_from_docx(mock_document):
    # Setup mock
    mock_doc = MagicMock()
    mock_paragraph = MagicMock()
    mock_paragraph.text = "Sample DOCX Text"
    mock_doc.paragraphs = [mock_paragraph]
    mock_doc.tables = []
    mock_document.return_value = mock_doc

    result = await TextExtractor.extract_from_docx(Path("test.docx"))
    assert result == "Sample DOCX Text"
