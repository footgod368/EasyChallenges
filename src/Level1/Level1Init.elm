module Level1Init exposing (init)

{-| Init of Level1 Model.


# init

@docs init

-}

import Array
import Boundary
import Brick
import Browser.Dom exposing (getViewport)
import EndPoint
import Event
import GlobalBasics
import Level1Type
import MainType
import Monster
import Needle
import NoticeBoard
import Player
import SavePoint
import Task


{-| `init` of Level1 \`Model
-}
init : ( Level1Type.Model, Cmd MainType.Msg )
init =
    let
        newModel =
            { windowBoundary = ( 1000.0, 800.0 )
            , levelBoundary = ( 80 * 40, 680.0 )
            , actEvent = Array.fromList []
            , event =
                Array.fromList
                    [ Event.init
                        { id = 1, name = "first falling ground" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon
                                (Array.fromList
                                    [ ( GlobalBasics.blockPos ( 6, 1 ), GlobalBasics.blockPos ( 6, 15 ) )
                                    ]
                                )
                            )
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 2, name = "first ?" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon (Array.fromList [ ( ( 560, 490 ), ( 600, 490 ) ) ]))
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 3, name = "first falling needles" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon (Array.fromList [ ( GlobalBasics.blockPos ( 23, 13 ), GlobalBasics.blockPos ( 23, 20 ) ) ]))
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 4, name = "second ?" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon (Array.fromList [ ( GlobalBasics.blockPos ( 24, 10 ), GlobalBasics.blockPos ( 25, 10 ) ) ]))
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 5, name = "fisrt hidden brick" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (Brick.quickCollisionBox ( 4.5, 12 ) Brick.NormalAppearance)
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 6, name = "second hidden brick" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (Brick.quickCollisionBox ( 5.5, 12 ) Brick.NormalAppearance)
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 7, name = "third hidden brick" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (Brick.quickCollisionBox ( 32.5, 12 ) Brick.NormalAppearance)
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 8, name = "fourth hidden brick" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (Brick.quickCollisionBox ( 33.5, 12 ) Brick.NormalAppearance)
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 9, name = "first hidden needles" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon
                                (Array.fromList
                                    [ ( GlobalBasics.blockPos_ ( 31, 9.26 ), GlobalBasics.blockPos_ ( 37, 9.26 ) )
                                    , ( GlobalBasics.blockPos_ ( 31, 8.9 ), GlobalBasics.blockPos_ ( 37, 8.9 ) )
                                    ]
                                )
                            )
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 10, name = "fifth hidden brick" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (Brick.quickCollisionBox ( 44, 12 ) Brick.NormalAppearance)
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 11, name = "sixth hidden brick" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (Brick.quickCollisionBox ( 45, 12 ) Brick.NormalAppearance)
                        )
                        (Event.quickDuration 10)
                    ]
            , boundary = Boundary.normalInit
            , player = Player.init ( 50.0, 490.0 )
            , bricks =
                Array.fromList
                    (List.concat
                        [ NoticeBoard.boundary ( 2, 5 ) ( 7, 4 )
                        , Brick.initRow 15 1 4
                        , Brick.initFallingRow 15 5 8 1
                        , Brick.initRow 15 9 32
                        , Brick.initRow 12 22 26
                        , [ Brick.initPosVolumeColor (GlobalBasics.blockPos_ ( 15, 12 )) ( 40, 40 ) "#FFFF00" ]
                        , [ Brick.initPosVolumeColor (GlobalBasics.blockPos_ ( 24, 9 )) ( 40, 40 ) "#FFFF00" ]
                        , [ Brick.initCollideHidden ( 25, 9 ) 4
                          , Brick.initCollideHidden ( 26, 9 ) 4
                          , Brick.initCollideHidden ( 26, 10 ) 4
                          , Brick.initCollideHidden ( 26, 11 ) 4
                          , Brick.initCollideHidden ( 23, 9 ) 4
                          , Brick.initCollideHidden ( 22, 9 ) 4
                          , Brick.initCollideHidden ( 22, 10 ) 4
                          , Brick.initCollideHidden ( 22, 11 ) 4
                          ]
                        , [ Brick.initNoCollideHidden ( 4.5, 12 ) 5
                          , Brick.initNoCollideHidden ( 5.5, 12 ) 6
                          ]
                        , Brick.initRow 15 36 80
                        , NoticeBoard.boundary ( 31, 5 ) ( 7, 4 )
                        , [ Brick.initNoCollideHidden ( 32.5, 12 ) 7
                          , Brick.initNoCollideHidden ( 33.5, 12 ) 8
                          ]
                        , [ Brick.initNoCollideHidden ( 44, 12 ) 10
                          , Brick.initNoCollideHidden ( 45, 12 ) 11
                          ]
                        , [ Brick.initPosVolumeColor (GlobalBasics.blockPos_ ( 55, 11.5 )) ( 2.0 * 40.0, 3.5 * 40.0 ) "#008000"
                          , Brick.initPosVolumeColor (GlobalBasics.blockPos_ ( 67, 11.5 )) ( 2.0 * 40.0, 3.5 * 40.0 ) "#008000"
                          ]
                        ]
                    )
            , savePoints =
                Array.fromList
                    [ SavePoint.init (GlobalBasics.blockPos ( 2, 14 ))
                    , SavePoint.init (GlobalBasics.blockPos ( 41, 14 ))
                    ]
            , endPoint = EndPoint.init (GlobalBasics.blockPos ( 76, 14 ))
            , noticeBoards =
                Array.fromList
                    [ NoticeBoard.quickInit (GlobalBasics.blockPos_ ( 5.5, 7.5 )) "Welcome!" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPos_ ( 34.5, 7.5 )) "Caution!" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPos_ ( 15.5, 12.85 )) "?" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPos_ ( 24.5, 9.85 )) "?" 40
                    ]
            , needles =
                Array.fromList
                    (List.concat
                        [ [ Needle.initHidden ( 15, 13 ) 2 ]
                        , Needle.initFallingRow 13 22 26 3
                        , [ Needle.initHiddenCollideAfter ( 25, 12 ) 4 ]
                        , Needle.initHiddenRow 9 31 37 9
                        , [ Needle.initPos (GlobalBasics.blockPos_ ( 46.0, 14.75 ))
                          , Needle.initPos (GlobalBasics.blockPos_ ( 47.0, 14.75 ))
                          , Needle.initPos (GlobalBasics.blockPos_ ( 48.0, 14.75 ))
                          , Needle.initPos (GlobalBasics.blockPos_ ( 49.0, 14.75 ))
                          ]
                        ]
                    )
            , monsters =
                Array.fromList
                    [ Monster.init (GlobalBasics.blockPos_ ( 66, 14 ))
                        (Monster.MonsterA 40 40)
                        (Monster.ListenX 100)
                        (Monster.ListenY 100)
                        1
                        ( 56 * 40, 65 * 40 )
                    ]
            , keyPressed = []
            }
    in
    ( newModel, Task.perform MainType.GetViewport getViewport )
