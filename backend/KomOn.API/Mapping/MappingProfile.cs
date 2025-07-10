using AutoMapper;
using KomOn.Core.Entities;
using KomOn.API.DTOs;

namespace KomOn.API.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Mapping User -> UserDto
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.Bio))
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl))
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt));

        // Mapping UserDto -> User (pour les mises à jour)
        CreateMap<UserDto, User>()
            .ForMember(dest => dest.Id, opt => opt.Ignore()) // Ne pas mapper l'ID lors des mises à jour
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()) // Ne pas mapper le hash du mot de passe
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Ne pas mapper la date de création
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

        // Mapping RegisterRequest -> User (pour la création)
        CreateMap<RegisterRequest, User>()
            .ForMember(dest => dest.Id, opt => opt.Ignore()) // Sera généré automatiquement
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()) // Sera hashé par le service
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => "participant"))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "active"))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.OrganizedEvents, opt => opt.Ignore())
            .ForMember(dest => dest.EventRegistrations, opt => opt.Ignore())
            .ForMember(dest => dest.UserSports, opt => opt.Ignore())
            .ForMember(dest => dest.SentMessages, opt => opt.Ignore())
            .ForMember(dest => dest.ReceivedMessages, opt => opt.Ignore());
    }
} 