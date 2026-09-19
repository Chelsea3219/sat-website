# Import Python libraries and files
import numpy as np
from PIL import Image


# TRIM THE EXCESSIVE WHITESPACE ----------------------------------------------------------------------------------------
def trim_whitespace_pp(image):
    # Removes the header and footer
    img = image.crop((0, 290, 2432, 3306))

    # Identify the white vertical spaces
    img = np.array(img.convert('L'))
    column_avg = np.mean(img, axis=0) # If the avg is 255 (white) the column is white
    nonempty_cols = np.where(column_avg < 254)[0]

    if len(nonempty_cols) > 0:
        trimmed_image = img[:,nonempty_cols]
        final_image = Image.fromarray(trimmed_image)
        return final_image
    return None


# SEPARATE IMAGE IN HALF -----------------------------------------------------------------------------------------------
def split_image (image):
    width, height = image.size
    split_x = (width // 2)

    left_half = image.crop((0, 0, split_x, height))
    right_half = image.crop((split_x, 0, width, height))

    return left_half, right_half


# QUESTION IDENTIFIER --------------------------------------------------------------------------------------------------
def question_identifier(pil_image, min_gap=20):
    img = np.array(pil_image.convert('L'))  # grayscale

    # Find rows that have text (dark pixels)
    row_has_text = np.any(img < 200, axis=1)  # True if row has dark pixel

    # Find where text starts and stops (transitions)
    blocks = []
    in_block = False
    block_start = 0
    gap_count = 0

    for row_idx, has_text in enumerate(row_has_text):
        if has_text:
            if not in_block:
                block_start = row_idx
                in_block = True
            gap_count = 0
        else:
            if in_block:
                gap_count += 1
                # Only end the block if gap is large enough (separates questions)
                if gap_count > min_gap:
                    blocks.append((block_start, row_idx - gap_count))
                    in_block = False
                    gap_count = 0

    # Catch last block
    if in_block:
        blocks.append((block_start, len(row_has_text)))

    return blocks


# CROP THE QUESTION BLOCKS ---------------------------------------------------------------------------------------------
def crop_question_blocks(pil_image, padding=2):
    width, height = pil_image.size
    blocks = question_identifier(pil_image)

    cropped = []
    for top, bottom in blocks:
        top = max(0, top - padding)
        bottom = min(height, bottom + padding)
        crop = pil_image.crop((0, top, width, bottom))
        cropped.append(crop)
    return cropped