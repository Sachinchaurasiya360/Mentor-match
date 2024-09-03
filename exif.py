from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

def get_exif_data(image_path):
    image = Image.open(image_path)
    exif_data = image._getexif()

    if not exif_data:
        return None

    exif = {}
    for tag, value in exif_data.items():
        tag_name = TAGS.get(tag, tag)
        exif[tag_name] = value

    return exif

def get_labeled_exif(exif):
    if not exif:
        return None
    
    labeled_exif = {}
    
    # Extract specific metadata
    labeled_exif['Camera Make'] = exif.get('Make')
    labeled_exif['Camera Model'] = exif.get('Model')
    labeled_exif['Date and Time'] = exif.get('DateTime')
    
    # Extract GPS data if available
    gps_info = exif.get('GPSInfo')
    if gps_info:
        labeled_exif['GPS Info'] = {}
        for key in gps_info.keys():
            name = GPSTAGS.get(key, key)
            labeled_exif['GPS Info'][name] = gps_info[key]

    return labeled_exif

def get_gps_coordinates(gps_info):
    if not gps_info:
        return None

    def convert_to_degrees(value):
        d = float(value[0])
        m = float(value[1])
        s = float(value[2])
        return d + (m / 60.0) + (s / 3600.0)

    lat = gps_info.get('GPSLatitude')
    lat_ref = gps_info.get('GPSLatitudeRef')
    lon = gps_info.get('GPSLongitude')
    lon_ref = gps_info.get('GPSLongitudeRef')

    if not lat or not lon or not lat_ref or not lon_ref:
        return None

    lat = convert_to_degrees(lat)
    if lat_ref != 'N':
        lat = -lat

    lon = convert_to_degrees(lon)
    if lon_ref != 'E':
        lon = -lon

    return lat, lon

def print_exif_data(exif):
    if exif is None:
        print("No EXIF data found.")
    else:
        for tag, value in exif.items():
            if isinstance(value, dict):  # Handle nested dictionaries like GPS Info
                print(f"{tag}:")
                for sub_tag, sub_value in value.items():
                    print(f"  {sub_tag}: {sub_value}")
            else:
                print(f"{tag}: {value}")

# Example usage
image_path = r'C:\Users\Sachin chaurasiya\Downloads\aa.jpg'  # Replace with your image path

exif_data = get_exif_data(image_path)
labeled_exif = get_labeled_exif(exif_data)

print_exif_data(labeled_exif)

# Get GPS coordinates if available
gps_info = labeled_exif.get('GPS Info')
coordinates = get_gps_coordinates(gps_info)

if coordinates:
    print(f"GPS Coordinates: {coordinates}")
